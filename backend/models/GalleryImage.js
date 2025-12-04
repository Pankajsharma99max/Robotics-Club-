import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Robotics Projects', 'Workshops', 'Hackathons', 'Hardware Lab', 'Other'],
        required: true
    },
    caption: {
        type: String,
        default: ''
    },
    isVideo: {
        type: Boolean,
        default: false
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('GalleryImage', galleryImageSchema);
