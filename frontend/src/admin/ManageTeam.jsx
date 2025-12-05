import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { teamService } from '../services/teamService';
import { FaPlus, FaEdit, FaTrash, FaGithub, FaLinkedin, FaTwitter, FaTimes, FaUser, FaUpload } from 'react-icons/fa';

const ManageTeam = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        image: null,
        socialLinks: { linkedin: '', github: '', twitter: '' }
    });
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        try {
            const data = await teamService.getAll();
            setMembers(data);
        } catch (error) {
            console.error('Failed to load team:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name in formData.socialLinks) {
            setFormData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const openModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                role: member.role,
                image: null,
                socialLinks: {
                    linkedin: member.socialLinks?.linkedin || '',
                    github: member.socialLinks?.github || '',
                    twitter: member.socialLinks?.twitter || ''
                }
            });
            setImagePreview(member.image || '');
        } else {
            setEditingMember(null);
            setFormData({
                name: '',
                role: '',
                image: null,
                socialLinks: { linkedin: '', github: '', twitter: '' }
            });
            setImagePreview('');
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingMember) {
                await teamService.update(editingMember._id, formData);
            } else {
                await teamService.create(formData);
            }
            await loadTeam();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save member:', error);
            alert('Failed to save member');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            try {
                await teamService.delete(id);
                setMembers(members.filter(m => m._id !== id));
            } catch (error) {
                console.error('Failed to delete member:', error);
                alert('Failed to delete member');
            }
        }
    };

    if (loading && !isModalOpen) return <div className="text-center text-white">Loading team...</div>;

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-display text-4xl font-bold gradient-text">Manage Team</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-neon-blue text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-colors flex items-center gap-2"
                >
                    <FaPlus /> Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map(member => (
                    <motion.div
                        key={member._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-6 text-center relative group"
                    >
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => openModal(member)}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => handleDelete(member._id)}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-neon-blue p-1">
                            <img
                                src={member.image || `https://ui-avatars.com/api/?name=${member.name}&background=0D8ABC&color=fff`}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <h3 className="font-display text-xl font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-neon-blue text-sm mb-4">{member.role}</p>

                        <div className="flex justify-center space-x-4">
                            {member.socialLinks?.linkedin && <FaLinkedin className="text-gray-400" />}
                            {member.socialLinks?.github && <FaGithub className="text-gray-400" />}
                            {member.socialLinks?.twitter && <FaTwitter className="text-gray-400" />}
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
                                {editingMember ? 'Edit Member' : 'Add New Member'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Role</label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g. President, Lead Developer"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Profile Image</label>
                                    <div className="flex items-center gap-4">
                                        {imagePreview && (
                                            <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-white/10" />
                                        )}
                                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                                            <FaUpload /> Upload Image
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Social Links</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-gray-400 mb-2 flex items-center gap-2"><FaLinkedin /> LinkedIn</label>
                                            <input
                                                type="url"
                                                name="linkedin"
                                                value={formData.socialLinks.linkedin}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-2 flex items-center gap-2"><FaGithub /> GitHub</label>
                                            <input
                                                type="url"
                                                name="github"
                                                value={formData.socialLinks.github}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 mb-2 flex items-center gap-2"><FaTwitter /> Twitter</label>
                                            <input
                                                type="url"
                                                name="twitter"
                                                value={formData.socialLinks.twitter}
                                                onChange={handleInputChange}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-neon-blue text-black px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : (editingMember ? 'Update Member' : 'Add Member')}
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
export default ManageTeam;
