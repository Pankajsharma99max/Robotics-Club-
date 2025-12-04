import express from 'express';
import {
    getGalleryImages,
    getGalleryImage,
    uploadGalleryImages,
    updateGalleryImage,
    deleteGalleryImage
} from '../controllers/galleryController.js';
import { protect, editorOrAdmin } from '../middleware/auth.js';
import { upload, optimizeImage } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getGalleryImages);
router.get('/:id', getGalleryImage);
router.post('/', protect, editorOrAdmin, upload.array('images', 20), optimizeImage, uploadGalleryImages);
router.put('/:id', protect, editorOrAdmin, upload.single('image'), optimizeImage, updateGalleryImage);
router.delete('/:id', protect, editorOrAdmin, deleteGalleryImage);

export default router;
