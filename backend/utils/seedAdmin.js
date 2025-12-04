import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const adminExists = await User.findOne({ role: 'Admin' });

        if (adminExists) {
            console.log('⚠️  Admin user already exists');
            console.log('Email:', adminExists.email);
            process.exit(0);
        }

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = await User.create({
            username: 'admin',
            email: 'admin@roboticsclub.com',
            password: hashedPassword,
            role: 'Admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  IMPORTANT: Change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
