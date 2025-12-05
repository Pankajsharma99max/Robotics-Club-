import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { achievementService } from '../services/achievementService';
import { FaPlus, FaEdit, FaTrash, FaTrophy, FaCalendar, FaTimes, FaImage, FaLink } from 'react-icons/fa';

const ManageAchievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        category: 'Competition',
        externalLinks: [],
        images: []
    });
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        loadAchievements();
    }, []);

    const loadAchievements = async () => {
        try {
            const data = await achievementService.getAll();
            setAchievements(data);
        } catch (error) {
            console.error('Failed to load achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFormData(prev => ({ ...prev, images: files }));
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(newPreviews);
        }
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...formData.externalLinks];
        newLinks[index][field] = value;
        setFormData(prev => ({ ...prev, externalLinks: newLinks }));
    };

    const addLink = () => {
        setFormData(prev => ({
            ...prev,
            externalLinks: [...prev.externalLinks, { label: '', url: '' }]
        }));
    };

    const removeLink = (index) => {
        const newLinks = formData.externalLinks.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, externalLinks: newLinks }));
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                description: item.description,
                date: item.date ? item.date.split('T')[0] : '',
                category: item.category,
                externalLinks: item.externalLinks || [],
                images: [] // We don't populate existing images file objects, only for new uploads
            });
            setImagePreviews(item.images || []);
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                description: '',
                date: '',
                category: 'Competition',
                externalLinks: [],
                images: []
            });
            setImagePreviews([]);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingItem) {
                await achievementService.update(editingItem._id, formData);
            } else {
                await achievementService.create(formData);
            }
            await loadAchievements();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save achievement:', error);
            alert('Failed to save achievement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this achievement?')) {
            try {
                await achievementService.delete(id);
                setAchievements(achievements.filter(a => a._id !== id));
            } catch (error) {
                console.error('Failed to delete achievement:', error);
                alert('Failed to delete achievement');
            }
        }
    };

    if (loading && !isModalOpen) return <div className="text-center text-white">Loading achievements...</div>;

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-display text-4xl font-bold gradient-text">Manage Achievements</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-neon-blue text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-colors flex items-center gap-2"
                >
                    <FaPlus /> Add Achievement
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map(item => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card overflow-hidden group"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={item.images?.[0] || 'https://via.placeholder.com/400x200'}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
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
                            <span className="absolute bottom-2 left-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white">
                                {item.category}
                            </span>
                        </div>
                        <div className="p-6">
                            <h3 className="font-display text-xl font-bold text-white mb-2">{item.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                <FaCalendar className="text-neon-blue" />
                                {item.date ? new Date(item.date).toLocaleDateString() : 'No Date'}
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
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
                            className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <FaTimes size={24} />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">
                                {editingItem ? 'Edit Achievement' : 'Add Achievement'}
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                        >
                                            <option value="Competition">Competition</option>
                                            <option value="Award">Award</option>
                                            <option value="Recognition">Recognition</option>
                                            <option value="Project">Project</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Images (Select multiple)</label>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                                                <FaImage /> Choose Images
                                                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                                            </label>
                                            <span className="text-gray-400 text-sm">{formData.images.length} new files selected</span>
                                        </div>
                                        {imagePreviews.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {imagePreviews.map((src, idx) => (
                                                    <img key={idx} src={src} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-white/10" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-gray-400">External Links</label>
                                        <button type="button" onClick={addLink} className="text-neon-blue text-sm hover:underline flex items-center gap-1">
                                            <FaPlus size={12} /> Add Link
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.externalLinks.map((link, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Label (e.g. GitHub)"
                                                    value={link.label}
                                                    onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-blue focus:outline-none"
                                                />
                                                <input
                                                    type="url"
                                                    placeholder="URL"
                                                    value={link.url}
                                                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                                    className="flex-[2] bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-blue focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeLink(index)}
                                                    className="text-red-500 hover:text-red-400 p-2"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-neon-blue text-black px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : (editingItem ? 'Update Achievement' : 'Add Achievement')}
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
export default ManageAchievements;
