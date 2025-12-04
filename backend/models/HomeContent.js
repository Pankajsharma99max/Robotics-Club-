import mongoose from 'mongoose';

const homeContentSchema = new mongoose.Schema({
    heroTitle: {
        type: String,
        default: 'ROBOTICS CLUB'
    },
    heroSubtitle: {
        type: String,
        default: 'Building the Future with Innovation'
    },
    heroBackground: {
        type: String,
        default: ''
    },
    stats: {
        members: { type: Number, default: 0 },
        projects: { type: Number, default: 0 },
        awards: { type: Number, default: 0 },
        workshops: { type: Number, default: 0 }
    },
    model3DSettings: {
        enabled: { type: Boolean, default: true },
        modelType: { type: String, default: 'robot' }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('HomeContent', homeContentSchema);
