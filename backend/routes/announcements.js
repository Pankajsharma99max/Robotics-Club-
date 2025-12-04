import express from 'express';
import {
    getAnnouncements,
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} from '../controllers/announcementController.js';
import { protect, editorOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.get('/all', protect, editorOrAdmin, getAllAnnouncements);
router.post('/', protect, editorOrAdmin, createAnnouncement);
router.put('/:id', protect, editorOrAdmin, updateAnnouncement);
router.delete('/:id', protect, editorOrAdmin, deleteAnnouncement);

export default router;
