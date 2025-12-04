import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
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
    endDate: {
        type: Date
    },
    type: {
        type: String,
        enum: ['Workshop', 'Hackathon', 'Competition', 'Guest Lecture'],
        required: true
    },
    banner: {
        type: String, // URL to uploaded image
        default: ''
    },
    schedulePDF: {
        type: String, // URL to uploaded PDF
        default: ''
    },
    registrationLink: {
        type: String,
        default: ''
    },
    venue: {
        type: String,
        default: ''
    },
    isUpcoming: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual to check if event is past
eventSchema.virtual('isPast').get(function () {
    return this.date < new Date();
});

export default mongoose.model('Event', eventSchema);
