import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '../services/galleryService';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTimes, FaUpload } from 'react-icons/fa';

const ManageGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        category: 'Events',
        caption: '',
        images: []
    });
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        loadGallery();
    }, []);

    const loadGallery = async () => {
        try {
            const data = await galleryService.getAll();
            setImages(data);
        } catch (error) {
            console.error('Failed to load gallery:', error);
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

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                category: item.category,
                caption: item.caption || '',
                images: [] // We don't populate existing images file objects, only for new uploads
            });
            setImagePreviews([item.imageUrl]);
        } else {
            setEditingItem(null);
            setFormData({
                category: 'Events',
                caption: '',
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
                // For updates, we might be updating caption/category or replacing image
                // The service expects 'images' for upload but 'image' for update if replacing
                // Let's adapt based on service implementation
                const updateData = {
                    category: formData.category,
                    caption: formData.caption
                };
                if (formData.images.length > 0) {
                    updateData.image = formData.images[0];
                }
                await galleryService.update(editingItem._id, updateData);
            } else {
                await galleryService.upload(formData.images, formData.category, formData.caption);
            }
            await loadGallery();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save gallery item:', error);
            alert('Failed to save gallery item');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await galleryService.delete(id);
                setImages(images.filter(img => img._id !== id));
            } catch (error) {
                console.error('Failed to delete image:', error);
                alert('Failed to delete image');
            }
        }
    };

    if (loading && !isModalOpen) return <div className="text-center text-white">Loading gallery...</div>;

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-display text-4xl font-bold gradient-text">Manage Gallery</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-neon-blue text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-colors flex items-center gap-2"
                >
                    <FaPlus /> Upload Images
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map(item => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card overflow-hidden group relative"
                    >
                        <div className="aspect-square overflow-hidden">
                            <img
                                src={item.imageUrl}
                                alt={item.caption || 'Gallery Image'}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                            <div className="flex justify-end gap-2">
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
                            <div>
                                <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-neon-blue text-black mb-1">
                                    {item.category}
                                </span>
                                {item.caption && (
                                    <p className="text-white text-sm line-clamp-2">{item.caption}</p>
                                )}
                            </div>
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
                                {editingItem ? 'Edit Image' : 'Upload Images'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                    >
                                        <option value="Events">Events</option>
                                        <option value="Workshops">Workshops</option>
                                        <option value="Projects">Projects</option>
                                        <option value="Competitions">Competitions</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Caption (Optional)</label>
                                    <input
                                        type="text"
                                        name="caption"
                                        value={formData.caption}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">
                                        {editingItem ? 'Replace Image (Optional)' : 'Select Images (Multiple allowed)'}
                                    </label>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                                                <FaImage /> Choose Files
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple={!editingItem}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            <span className="text-gray-400 text-sm">
                                                {formData.images.length} file(s) selected
                                            </span>
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

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-neon-blue text-black px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : (editingItem ? 'Update Image' : 'Upload')}
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
export default ManageGallery;
