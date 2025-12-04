import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        enum: ['Award', 'Competition', 'Project', 'Publication'],
        required: true
    },
    images: [{
        type: String
    }],
    certificates: [{
        type: String
    }],
    externalLinks: [{
        title: String,
        url: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Achievement', achievementSchema);
