import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { announcementService } from '../services/contentService';
import { FaPlus, FaEdit, FaTrash, FaBullhorn, FaTimes, FaCheck, FaExclamationCircle } from 'react-icons/fa';

const ManageAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        active: true
    });

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const data = await announcementService.getAll();
            setAnnouncements(data);
        } catch (error) {
            console.error('Failed to load announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                message: item.message,
                type: item.type,
                active: item.active
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                message: '',
                type: 'info',
                active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingItem) {
                await announcementService.update(editingItem._id, formData);
            } else {
                await announcementService.create(formData);
            }
            await loadAnnouncements();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save announcement:', error);
            alert('Failed to save announcement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await announcementService.delete(id);
                setAnnouncements(announcements.filter(a => a._id !== id));
            } catch (error) {
                console.error('Failed to delete announcement:', error);
                alert('Failed to delete announcement');
            }
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'urgent': return 'text-red-500 border-red-500/50';
            case 'success': return 'text-green-500 border-green-500/50';
            case 'warning': return 'text-yellow-500 border-yellow-500/50';
            default: return 'text-blue-500 border-blue-500/50';
        }
    };

    if (loading && !isModalOpen) return <div className="text-center text-white">Loading announcements...</div>;

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-display text-4xl font-bold gradient-text">Manage Announcements</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-neon-blue text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-colors flex items-center gap-2"
                >
                    <FaPlus /> Add Announcement
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map(item => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`glass-card p-6 border-l-4 ${getTypeColor(item.type).split(' ')[1]} relative group`}
                    >
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => openModal(item)}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <FaBullhorn className={getTypeColor(item.type).split(' ')[0]} />
                            <span className={`text-sm font-bold uppercase ${getTypeColor(item.type).split(' ')[0]}`}>
                                {item.type}
                            </span>
                            {!item.active && (
                                <span className="ml-auto text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                                    Inactive
                                </span>
                            )}
                        </div>

                        <h3 className="font-display text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.message}</p>
                        <div className="mt-4 text-xs text-gray-500">
                            Posted: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card w-full max-w-lg p-8 relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <FaTimes size={24} />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">
                                {editingItem ? 'Edit Announcement' : 'Add Announcement'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                    >
                                        <option value="info">Info (Blue)</option>
                                        <option value="success">Success (Green)</option>
                                        <option value="warning">Warning (Yellow)</option>
                                        <option value="urgent">Urgent (Red)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 rounded border-gray-300 text-neon-blue focus:ring-neon-blue"
                                    />
                                    <label className="text-gray-400">Active (Visible on site)</label>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-neon-blue text-black px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : (editingItem ? 'Update Announcement' : 'Add Announcement')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default ManageAnnouncements;
