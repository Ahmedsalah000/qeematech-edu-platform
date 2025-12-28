import { Router } from 'express';
import {
    getProfile,
    updateStudentProfile,
    updateSchoolProfile
} from '../controllers/profile.controller.js';
import { requireAuth, requireStudent, requireAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate, updateStudentProfileSchema, updateSchoolProfileSchema } from '../validators/index.js';

const router = Router();

// Get profile - works for both student and admin
router.get('/', requireAuth, getProfile);

// Update student profile
router.put('/student', requireAuth, requireStudent, upload.single('profileImage'), validate(updateStudentProfileSchema), updateStudentProfile);

// Update school profile (admin)
router.put('/school', requireAuth, requireAdmin, upload.single('logo'), validate(updateSchoolProfileSchema), updateSchoolProfile);

export default router;
