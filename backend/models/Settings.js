import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    clubName: {
        type: String,
        default: 'Robotics Club'
    },
    logo: {
        type: String,
        default: ''
    },
    themeColors: {
        primary: { type: String, default: '#00f0ff' }, // Neon blue
        secondary: { type: String, default: '#b000ff' }, // Neon purple
        accent: { type: String, default: '#ff00ff' }
    },
    socialLinks: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        youtube: { type: String, default: '' },
        github: { type: String, default: '' }
    },
    contactInfo: {
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        whatsapp: { type: String, default: '' },
        address: { type: String, default: '' }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Settings', settingsSchema);
