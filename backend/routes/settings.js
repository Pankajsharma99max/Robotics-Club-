import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload, optimizeImage } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, adminOnly, upload.single('logo'), optimizeImage, updateSettings);

export default router;
