import express from 'express';
import {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} from '../controllers/eventController.js';
import { protect, editorOrAdmin } from '../middleware/auth.js';
import { upload, optimizeImage } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post(
    '/',
    protect,
    editorOrAdmin,
    upload.fields([
        { name: 'banner', maxCount: 1 },
        { name: 'schedulePDF', maxCount: 1 }
    ]),
    optimizeImage,
    createEvent
);
router.put(
    '/:id',
    protect,
    editorOrAdmin,
    upload.fields([
        { name: 'banner', maxCount: 1 },
        { name: 'schedulePDF', maxCount: 1 }
    ]),
    optimizeImage,
    updateEvent
);
router.delete('/:id', protect, editorOrAdmin, deleteEvent);

export default router;
