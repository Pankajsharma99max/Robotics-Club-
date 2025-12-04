import Announcement from '../models/Announcement.js';

// @desc    Get active announcements
// @route   GET /api/announcements
// @access  Public
export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({
            isActive: true,
            expiryDate: { $gte: new Date() }
        }).sort({ priority: -1, createdAt: -1 });

        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all announcements (admin)
// @route   GET /api/announcements/all
// @access  Private
export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private
export const createAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.create(req.body);
        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private
export const updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedAnnouncement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private
export const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
