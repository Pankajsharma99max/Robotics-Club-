import Settings from '../models/Settings.js';

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // Create default if doesn't exist
        if (!settings) {
            settings = await Settings.create({});
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private (Admin only)
export const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        const updateData = { ...req.body };

        // Parse nested objects if they're strings
        if (typeof updateData.themeColors === 'string') {
            updateData.themeColors = JSON.parse(updateData.themeColors);
        }
        if (typeof updateData.socialLinks === 'string') {
            updateData.socialLinks = JSON.parse(updateData.socialLinks);
        }
        if (typeof updateData.contactInfo === 'string') {
            updateData.contactInfo = JSON.parse(updateData.contactInfo);
        }

        // Handle logo upload
        if (req.file) {
            updateData.logo = `/uploads/${req.file.filename}`;
        }

        updateData.updatedAt = Date.now();

        if (settings) {
            settings = await Settings.findByIdAndUpdate(
                settings._id,
                updateData,
                { new: true, runValidators: true }
            );
        } else {
            settings = await Settings.create(updateData);
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
