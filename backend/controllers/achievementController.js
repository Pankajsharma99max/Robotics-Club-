import Achievement from '../models/Achievement.js';

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
export const getAchievements = async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};

        const achievements = await Achievement.find(query).sort({ date: -1 });
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
export const getAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create achievement
// @route   POST /api/achievements
// @access  Private
export const createAchievement = async (req, res) => {
    try {
        const achievementData = { ...req.body };

        // Parse externalLinks if it's a string
        if (typeof achievementData.externalLinks === 'string') {
            achievementData.externalLinks = JSON.parse(achievementData.externalLinks);
        }

        // Handle file uploads
        if (req.files) {
            if (req.files.images) {
                achievementData.images = req.files.images.map(file => `/uploads/${file.filename}`);
            }
            if (req.files.certificates) {
                achievementData.certificates = req.files.certificates.map(file => `/uploads/${file.filename}`);
            }
        }

        const achievement = await Achievement.create(achievementData);
        res.status(201).json(achievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private
export const updateAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        const updateData = { ...req.body };

        // Parse externalLinks if it's a string
        if (typeof updateData.externalLinks === 'string') {
            updateData.externalLinks = JSON.parse(updateData.externalLinks);
        }

        // Handle file uploads
        if (req.files) {
            if (req.files.images) {
                updateData.images = [
                    ...(achievement.images || []),
                    ...req.files.images.map(file => `/uploads/${file.filename}`)
                ];
            }
            if (req.files.certificates) {
                updateData.certificates = [
                    ...(achievement.certificates || []),
                    ...req.files.certificates.map(file => `/uploads/${file.filename}`)
                ];
            }
        }

        const updatedAchievement = await Achievement.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedAchievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private
export const deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        await Achievement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
