import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { settingsService } from '../services/contentService';
import { FaSave, FaUpload, FaPalette, FaGlobe, FaAddressCard } from 'react-icons/fa';

const Settings = () => {
    const [settings, setSettings] = useState({
        clubName: '',
        themeColors: { primary: '#00f0ff', secondary: '#b000ff', accent: '#ff00ff' },
        socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '', github: '' },
        contactInfo: { email: '', phone: '', whatsapp: '', address: '' }
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await settingsService.get();
            setSettings(data);
            if (data.logo) {
                const logoUrl = data.logo.startsWith('http')
                    ? data.logo
                    : `${import.meta.env.VITE_API_URL.replace('/api', '')}${data.logo}`;
                setLogoPreview(logoUrl);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            setMessage({ type: 'error', text: 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section) {
            setSettings(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
        } else {
            setSettings(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Create a copy and remove system fields
            const { _id, __v, createdAt, updatedAt, ...formData } = settings;

            if (logoFile) {
                formData.logo = logoFile;
            }

            await settingsService.update(formData);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });

            // Reload settings to get the latest state (including new logo URL if changed)
            loadSettings();
        } catch (error) {
            console.error('Failed to update settings:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to update settings';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center text-white">Loading settings...</div>;

    return (
        <div className="pb-20">
            <h1 className="font-display text-4xl font-bold gradient-text mb-8">Settings</h1>

            {message.text && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Settings */}
                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaPalette className="text-neon-blue" /> General & Branding
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Club Name</label>
                            <input
                                type="text"
                                name="clubName"
                                value={settings.clubName}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Logo</label>
                            <div className="flex items-center gap-4">
                                {logoPreview && (
                                    <img src={logoPreview} alt="Logo" className="w-16 h-16 object-contain bg-white/5 rounded-lg" />
                                )}
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                                    <FaUpload /> Upload Logo
                                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Theme Colors */}
                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Theme Colors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(settings.themeColors).map(([key, value]) => (
                            <div key={key}>
                                <label className="block text-gray-400 mb-2 capitalize">{key} Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        name={key}
                                        value={value}
                                        onChange={(e) => handleChange(e, 'themeColors')}
                                        className="h-10 w-10 rounded cursor-pointer bg-transparent border-0"
                                    />
                                    <input
                                        type="text"
                                        name={key}
                                        value={value}
                                        onChange={(e) => handleChange(e, 'themeColors')}
                                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Social Links */}
                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaGlobe className="text-neon-purple" /> Social Links
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(settings.socialLinks).map(([key, value]) => (
                            <div key={key}>
                                <label className="block text-gray-400 mb-2 capitalize">{key}</label>
                                <input
                                    type="url"
                                    name={key}
                                    value={value}
                                    onChange={(e) => handleChange(e, 'socialLinks')}
                                    placeholder={`https://${key}.com/...`}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Info */}
                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaAddressCard className="text-pink-500" /> Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(settings.contactInfo).map(([key, value]) => (
                            <div key={key} className={key === 'address' ? 'md:col-span-2' : ''}>
                                <label className="block text-gray-400 mb-2 capitalize">{key}</label>
                                {key === 'address' ? (
                                    <textarea
                                        name={key}
                                        value={value}
                                        onChange={(e) => handleChange(e, 'contactInfo')}
                                        rows="3"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={key}
                                        value={value}
                                        onChange={(e) => handleChange(e, 'contactInfo')}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-gradient-to-r from-neon-blue to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-neon-blue/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default Settings;
