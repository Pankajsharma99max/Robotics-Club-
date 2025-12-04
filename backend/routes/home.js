import express from 'express';
import { getHomeContent, updateHomeContent } from '../controllers/homeController.js';
import { protect, editorOrAdmin } from '../middleware/auth.js';
import { upload, optimizeImage } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getHomeContent);
router.put('/', protect, editorOrAdmin, upload.single('heroBackground'), optimizeImage, updateHomeContent);

export default router;
