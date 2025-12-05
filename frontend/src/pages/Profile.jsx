import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { compressImageClient, createPreviewURL, revokePreviewURL } from '../utils/imageCompression';
import api from '../services/api';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || ''
            });
            if (user.profilePicture) {
                setPreviewURL(`${import.meta.env.VITE_API_URL.replace('/api', '')}${user.profilePicture}`);
            }
        }
    }, [user]);

    useEffect(() => {
        return () => {
            if (previewURL && !user?.profilePicture) {
                revokePreviewURL(previewURL);
            }
        };
    }, [previewURL, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Compress image
            setMessage({ type: 'info', text: 'Compressing image...' });
            const compressedFile = await compressImageClient(file);

            setProfilePicture(compressedFile);

            // Create preview
            if (previewURL && !user?.profilePicture) {
                revokePreviewURL(previewURL);
            }
            setPreviewURL(createPreviewURL(compressedFile));

            setMessage({ type: 'success', text: `Image compressed to ${(compressedFile.size / 1024).toFixed(2)}KB` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to process image' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);

            if (profilePicture) {
                formDataToSend.append('profilePicture', profilePicture);
            }

            const response = await api.put('/auth/profile', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            updateUser(response.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setProfilePicture(null);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <p className="text-gray-400">Please login to view your profile</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
                        My Profile
                    </h1>

                    <div className="glass-card p-8">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg shadow-purple-500/50">
                                    {previewURL ? (
                                        <img
                                            src={previewURL}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-white">
                                                {user.username?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="profilePicture"
                                    className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition-all shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </label>
                                <input
                                    type="file"
                                    id="profilePicture"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-gray-400 text-sm mt-2">Click the icon to change picture</p>
                            <p className="text-gray-500 text-xs mt-1">Max 10MB • Will be compressed to 200KB</p>
                        </div>

                        {/* Message Display */}
                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`mb-6 px-4 py-3 rounded-lg text-sm ${message.type === 'success'
                                        ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                                        : message.type === 'error'
                                            ? 'bg-red-500/20 border border-red-500/50 text-red-200'
                                            : 'bg-blue-500/20 border border-blue-500/50 text-blue-200'
                                    }`}
                            >
                                {message.text}
                            </motion.div>
                        )}

                        {/* Profile Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white placeholder-gray-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white placeholder-gray-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Role</label>
                                <input
                                    type="text"
                                    value={user.role}
                                    disabled
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
