import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { homeService } from '../services/contentService';
import { FaSave, FaUpload, FaHome, FaChartBar, FaCube } from 'react-icons/fa';

const ManageHome = () => {
    const [content, setContent] = useState({
        heroTitle: '',
        heroSubtitle: '',
        heroCtaText: '',
        heroCtaLink: '',
        stats: [
            { label: 'Members', value: '0' },
            { label: 'Projects', value: '0' },
            { label: 'Awards', value: '0' },
            { label: 'Years', value: '0' }
        ],
        model3DSettings: {
            enabled: true,
            modelPath: '/models/robot.glb',
            scale: 1,
            autoRotate: true
        }
    });
    const [heroImageFile, setHeroImageFile] = useState(null);
    const [heroImagePreview, setHeroImagePreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const data = await homeService.get();
            if (data) {
                // Merge with defaults to ensure all fields exist
                setContent(prev => ({
                    ...prev,
                    ...data,
                    stats: data.stats || prev.stats,
                    model3DSettings: data.model3DSettings || prev.model3DSettings
                }));
                if (data.heroBackground) setHeroImagePreview(data.heroBackground);
            }
        } catch (error) {
            console.error('Failed to load home content:', error);
            setMessage({ type: 'error', text: 'Failed to load content' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
    };

    const handleStatChange = (index, field, value) => {
        const newStats = [...content.stats];
        newStats[index][field] = value;
        setContent(prev => ({ ...prev, stats: newStats }));
    };

    const handleModelChange = (e) => {
        const { name, value, type, checked } = e.target;
        setContent(prev => ({
            ...prev,
            model3DSettings: {
                ...prev.model3DSettings,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHeroImageFile(file);
            setHeroImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Remove system fields
            const { _id, __v, createdAt, updatedAt, ...formData } = content;

            if (heroImageFile) {
                formData.heroBackground = heroImageFile;
            }

            await homeService.update(formData);
            setMessage({ type: 'success', text: 'Home content updated successfully!' });
            loadContent();
        } catch (error) {
            console.error('Failed to update home content:', error);
            setMessage({ type: 'error', text: 'Failed to update content' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center text-white">Loading content...</div>;

    return (
        <div className="pb-20">
            <h1 className="font-display text-4xl font-bold gradient-text mb-8">Manage Home Content</h1>

            {message.text && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hero Section */}
                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaHome className="text-neon-blue" /> Hero Section
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-2">Hero Title</label>
                                <input
                                    type="text"
                                    name="heroTitle"
                                    value={content.heroTitle}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Hero Subtitle</label>
                                <textarea
                                    name="heroSubtitle"
                                    value={content.heroSubtitle}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-2">CTA Button Text</label>
                                <input
                                    type="text"
                                    name="heroCtaText"
                                    value={content.heroCtaText}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">CTA Button Link</label>
                                <input
                                    type="text"
                                    name="heroCtaLink"
                                    value={content.heroCtaLink}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Background Image</label>
                                <div className="flex items-center gap-4">
                                    {heroImagePreview && (
                                        <img src={heroImagePreview} alt="Preview" className="w-20 h-12 object-cover rounded-lg border border-white/10" />
                                    )}
                                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                                        <FaUpload /> Upload Image
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaChartBar className="text-neon-purple" /> Statistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {content.stats.map((stat, index) => (
                            <div key={index} className="bg-black/30 p-4 rounded-lg border border-white/5">
                                <div className="mb-2">
                                    <label className="block text-gray-500 text-xs mb-1">Label</label>
                                    <input
                                        type="text"
                                        value={stat.label}
                                        onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-sm focus:border-neon-purple focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-xs mb-1">Value</label>
                                    <input
                                        type="text"
                                        value={stat.value}
                                        onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-sm focus:border-neon-purple focus:outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3D Model Settings */}
                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaCube className="text-neon-pink" /> 3D Model Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Model Path</label>
                            <input
                                type="text"
                                name="modelPath"
                                value={content.model3DSettings.modelPath}
                                onChange={handleModelChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-pink focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Scale</label>
                            <input
                                type="number"
                                name="scale"
                                step="0.1"
                                value={content.model3DSettings.scale}
                                onChange={handleModelChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-pink focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="enabled"
                                    checked={content.model3DSettings.enabled}
                                    onChange={handleModelChange}
                                    className="w-4 h-4 rounded border-gray-300 text-neon-pink focus:ring-neon-pink"
                                />
                                <label className="text-gray-400">Enable 3D Model</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="autoRotate"
                                    checked={content.model3DSettings.autoRotate}
                                    onChange={handleModelChange}
                                    className="w-4 h-4 rounded border-gray-300 text-neon-pink focus:ring-neon-pink"
                                />
                                <label className="text-gray-400">Auto Rotate</label>
                            </div>
                        </div>
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
export default ManageHome;
