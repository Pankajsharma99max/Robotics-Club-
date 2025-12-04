import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import teamRoutes from './routes/team.js';
import achievementRoutes from './routes/achievements.js';
import galleryRoutes from './routes/gallery.js';
import homeRoutes from './routes/home.js';
import announcementRoutes from './routes/announcements.js';
import settingsRoutes from './routes/settings.js';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/settings', settingsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Robotics Club API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
});

export default app;
