import { Router } from 'express';
import {
    getAllLessons,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson
} from '../controllers/lesson.controller.js';
import { requireAuth, requireAdmin, requireAdminOrStudent } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate, createLessonSchema, updateLessonSchema } from '../validators/index.js';

const router = Router();

// Get lessons - accessible to both admin and student
router.get('/', requireAuth, requireAdminOrStudent, getAllLessons);
router.get('/:id', requireAuth, requireAdminOrStudent, getLessonById);

// Admin only routes
router.post('/', requireAuth, requireAdmin, upload.single('image'), validate(createLessonSchema), createLesson);
router.put('/:id', requireAuth, requireAdmin, upload.single('image'), validate(updateLessonSchema), updateLesson);
router.delete('/:id', requireAuth, requireAdmin, deleteLesson);

export default router;
