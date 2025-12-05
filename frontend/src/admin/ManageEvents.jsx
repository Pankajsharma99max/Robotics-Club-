import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventService } from '../services/eventService';
import { FaPlus, FaEdit, FaTrash, FaCalendar, FaMapMarkerAlt, FaTimes, FaImage } from 'react-icons/fa';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        status: 'Upcoming',
        registrationLink: '',
        banner: null
    });
    const [bannerPreview, setBannerPreview] = useState('');

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await eventService.getAll();
            setEvents(data);
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, banner: file }));
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const openModal = (event = null) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                title: event.title,
                description: event.description,
                date: event.date.split('T')[0],
                location: event.location,
                status: event.status,
                registrationLink: event.registrationLink || '',
                banner: null
            });
            setBannerPreview(event.banner || '');
        } else {
            setEditingEvent(null);
            setFormData({
                title: '',
                description: '',
                date: '',
                location: '',
                status: 'Upcoming',
                registrationLink: '',
                banner: null
            });
            setBannerPreview('');
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingEvent) {
                await eventService.update(editingEvent._id, formData);
            } else {
                await eventService.create(formData);
            }
            await loadEvents();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save event:', error);
            alert('Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventService.delete(id);
                setEvents(events.filter(e => e._id !== id));
            } catch (error) {
                console.error('Failed to delete event:', error);
                alert('Failed to delete event');
            }
        }
    };

    if (loading && !isModalOpen) return <div className="text-center text-white">Loading events...</div>;

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-display text-4xl font-bold gradient-text">Manage Events</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-neon-blue text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-colors flex items-center gap-2"
                >
                    <FaPlus /> Add Event
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card overflow-hidden group"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={event.banner || 'https://via.placeholder.com/400x200'}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => openModal(event)}
                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <span className={`absolute bottom-2 left-2 px-3 py-1 rounded-full text-xs font-bold ${event.status === 'Upcoming' ? 'bg-blue-500 text-white' :
                                    event.status === 'Ongoing' ? 'bg-green-500 text-white' :
                                        'bg-gray-500 text-white'
                                }`}>
                                {event.status}
                            </span>
                        </div>
                        <div className="p-6">
                            <h3 className="font-display text-xl font-bold text-white mb-2">{event.title}</h3>
                            <div className="space-y-2 text-sm text-gray-400 mb-4">
                                <div className="flex items-center gap-2">
                                    <FaCalendar className="text-neon-blue" />
                                    {new Date(event.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-neon-blue" />
                                    {event.location}
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
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
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">Event Title</label>
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
                                            required
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                        >
                                            <option value="Upcoming">Upcoming</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                    />
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
                                    <label className="block text-gray-400 mb-2">Banner Image</label>
                                    <div className="flex items-center gap-4">
                                        {bannerPreview && (
                                            <img src={bannerPreview} alt="Preview" className="w-32 h-20 object-cover rounded-lg" />
                                        )}
                                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                                            <FaImage /> Choose Image
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Registration Link (Optional)</label>
                                    <input
                                        type="url"
                                        name="registrationLink"
                                        value={formData.registrationLink}
                                        onChange={handleInputChange}
                                        placeholder="https://..."
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-neon-blue text-black px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
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
export default ManageEvents;
