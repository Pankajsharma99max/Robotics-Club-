import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['Core', 'Mentor', 'Technical', 'Design'],
        required: true
    },
    image: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    socialLinks: {
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        twitter: { type: String, default: '' },
        email: { type: String, default: '' }
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('TeamMember', teamMemberSchema);
