import express from 'express';
import multer from 'multer';
import { register, login, getMe, updatePassword, updateProfile } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

// Configure multer for memory storage (we'll process the image before saving)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max before compression
    }
});

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);

export default router;
