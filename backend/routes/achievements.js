import express from 'express';
import {
    getAchievements,
    getAchievement,
    createAchievement,
    updateAchievement,
    deleteAchievement
} from '../controllers/achievementController.js';
import { protect, editorOrAdmin } from '../middleware/auth.js';
import { upload, optimizeImage } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAchievements);
router.get('/:id', getAchievement);
router.post(
    '/',
    protect,
    editorOrAdmin,
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'certificates', maxCount: 5 }
    ]),
    optimizeImage,
    createAchievement
);
router.put(
    '/:id',
    protect,
    editorOrAdmin,
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'certificates', maxCount: 5 }
    ]),
    optimizeImage,
    updateAchievement
);
router.delete('/:id', protect, editorOrAdmin, deleteAchievement);

export default router;
