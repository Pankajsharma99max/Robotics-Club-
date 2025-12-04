import express from 'express';
import {
    getTeamMembers,
    getTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
} from '../controllers/teamController.js';
import { protect, editorOrAdmin } from '../middleware/auth.js';
import { upload, optimizeImage } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getTeamMembers);
router.get('/:id', getTeamMember);
router.post('/', protect, editorOrAdmin, upload.single('image'), optimizeImage, createTeamMember);
router.put('/:id', protect, editorOrAdmin, upload.single('image'), optimizeImage, updateTeamMember);
router.delete('/:id', protect, editorOrAdmin, deleteTeamMember);

export default router;
