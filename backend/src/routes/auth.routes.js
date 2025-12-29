import { Router } from 'express';
import {
    registerStudent,
    loginStudent,
    loginAdmin,
    logout,
    logoutAll,
    refresh,
    getMe,
    getSchools
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate, registerStudentSchema, loginSchema } from '../validators/index.js';

const router = Router();

// Public routes
router.get('/schools', getSchools);
router.post('/register/student', validate(registerStudentSchema), registerStudent);
router.post('/login/student', validate(loginSchema), loginStudent);
router.post('/login/admin', validate(loginSchema), loginAdmin);
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', logout);
router.post('/logout-all', requireAuth, logoutAll);
router.get('/me', requireAuth, getMe);

export default router;
