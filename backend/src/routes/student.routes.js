import { Router } from 'express';
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} from '../controllers/student.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate, createStudentSchema, updateStudentSchema } from '../validators/index.js';

const router = Router();

// All routes require auth + admin
router.use(requireAuth, requireAdmin);

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', upload.single('profileImage'), validate(createStudentSchema), createStudent);
router.put('/:id', upload.single('profileImage'), validate(updateStudentSchema), updateStudent);
router.delete('/:id', deleteStudent);

export default router;
