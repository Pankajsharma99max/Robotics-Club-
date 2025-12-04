import HomeContent from '../models/HomeContent.js';

// @desc    Get home content
// @route   GET /api/home
// @access  Public
export const getHomeContent = async (req, res) => {
    try {
        let content = await HomeContent.findOne();

        // Create default if doesn't exist
        if (!content) {
            content = await HomeContent.create({});
        }

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update home content
// @route   PUT /api/home
// @access  Private
export const updateHomeContent = async (req, res) => {
    try {
        let content = await HomeContent.findOne();

        const updateData = { ...req.body };

        // Parse stats if it's a string
        if (typeof updateData.stats === 'string') {
            updateData.stats = JSON.parse(updateData.stats);
        }

        // Parse model3DSettings if it's a string
        if (typeof updateData.model3DSettings === 'string') {
            updateData.model3DSettings = JSON.parse(updateData.model3DSettings);
        }

        // Handle background image upload
        if (req.file) {
            updateData.heroBackground = `/uploads/${req.file.filename}`;
        }

        updateData.updatedAt = Date.now();

        if (content) {
            content = await HomeContent.findByIdAndUpdate(
                content._id,
                updateData,
                { new: true, runValidators: true }
            );
        } else {
            content = await HomeContent.create(updateData);
        }

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
