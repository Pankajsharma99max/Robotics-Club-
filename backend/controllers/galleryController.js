import GalleryImage from '../models/GalleryImage.js';

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
export const getGalleryImages = async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};

        const images = await GalleryImage.find(query).sort({ uploadedAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single gallery image
// @route   GET /api/gallery/:id
// @access  Public
export const getGalleryImage = async (req, res) => {
    try {
        const image = await GalleryImage.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload gallery images (batch)
// @route   POST /api/gallery
// @access  Private
export const uploadGalleryImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const { category, caption } = req.body;
        const uploadedImages = [];

        for (const file of req.files) {
            const isVideo = file.mimetype.startsWith('video/');

            const image = await GalleryImage.create({
                url: `/uploads/${file.filename}`,
                category: category || 'Other',
                caption: caption || '',
                isVideo
            });

            uploadedImages.push(image);
        }

        res.status(201).json(uploadedImages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private
export const updateGalleryImage = async (req, res) => {
    try {
        const image = await GalleryImage.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const updateData = { ...req.body };

        // Handle file upload if new file provided
        if (req.file) {
            const isVideo = req.file.mimetype.startsWith('video/');
            updateData.url = `/uploads/${req.file.filename}`;
            updateData.isVideo = isVideo;
        }

        const updatedImage = await GalleryImage.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private
export const deleteGalleryImage = async (req, res) => {
    try {
        const image = await GalleryImage.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        await GalleryImage.findByIdAndDelete(req.params.id);
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
