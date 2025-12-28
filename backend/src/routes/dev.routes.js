import { Router } from 'express';
import prisma from '../utils/prisma.js';

const router = Router();

/**
 * ⚠️ DEVELOPMENT ONLY - Testing endpoints without Clerk auth
 * These endpoints bypass Clerk authentication for Postman testing
 * DO NOT USE IN PRODUCTION
 */

// Get all students (no auth)
router.get('/students', async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            include: { school: { select: { id: true, name: true } } }
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get student by ID (no auth)
router.get('/students/:id', async (req, res) => {
    try {
        const student = await prisma.student.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { school: true }
        });
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create student (no auth - for testing)
router.post('/students', async (req, res) => {
    try {
        const { name, email, phone, class: studentClass, academicYear, schoolId } = req.body;

        const student = await prisma.student.create({
            data: {
                clerkId: `dev-${Date.now()}`,
                name,
                email,
                phone,
                class: studentClass,
                academicYear,
                schoolId: parseInt(schoolId) || 1
            }
        });
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update student (no auth)
router.put('/students/:id', async (req, res) => {
    try {
        const { name, email, phone, class: studentClass, academicYear } = req.body;

        const student = await prisma.student.update({
            where: { id: parseInt(req.params.id) },
            data: { name, email, phone, class: studentClass, academicYear }
        });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete student (no auth)
router.delete('/students/:id', async (req, res) => {
    try {
        await prisma.student.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ LESSONS ============

// Get all lessons (no auth)
router.get('/lessons', async (req, res) => {
    try {
        const lessons = await prisma.lesson.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get lesson by ID
router.get('/lessons/:id', async (req, res) => {
    try {
        const lesson = await prisma.lesson.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create lesson (no auth)
router.post('/lessons', async (req, res) => {
    try {
        const { name, description, rating, schoolId } = req.body;

        const lesson = await prisma.lesson.create({
            data: {
                name,
                description,
                rating: parseFloat(rating) || 0,
                schoolId: parseInt(schoolId) || 1
            }
        });
        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update lesson
router.put('/lessons/:id', async (req, res) => {
    try {
        const { name, description, rating } = req.body;

        const lesson = await prisma.lesson.update({
            where: { id: parseInt(req.params.id) },
            data: { name, description, rating: parseFloat(rating) }
        });
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete lesson
router.delete('/lessons/:id', async (req, res) => {
    try {
        await prisma.lesson.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ FAVORITES ============

// Get student favorites
router.get('/favorites/:studentId', async (req, res) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { studentId: parseInt(req.params.studentId) },
            include: { lesson: true }
        });
        res.json(favorites.map(f => ({ ...f.lesson, isFavorite: true })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add to favorites
router.post('/favorites', async (req, res) => {
    try {
        const { studentId, lessonId } = req.body;

        const favorite = await prisma.favorite.create({
            data: {
                studentId: parseInt(studentId),
                lessonId: parseInt(lessonId)
            },
            include: { lesson: true }
        });
        res.status(201).json(favorite);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Already in favorites' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Remove from favorites
router.delete('/favorites', async (req, res) => {
    try {
        const { studentId, lessonId } = req.body;

        await prisma.favorite.deleteMany({
            where: {
                studentId: parseInt(studentId),
                lessonId: parseInt(lessonId)
            }
        });
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ SCHOOLS ============

// Get all schools
router.get('/schools', async (req, res) => {
    try {
        const schools = await prisma.school.findMany();
        res.json(schools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get school by ID
router.get('/schools/:id', async (req, res) => {
    try {
        const school = await prisma.school.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                _count: { select: { students: true, lessons: true } }
            }
        });
        if (!school) return res.status(404).json({ error: 'School not found' });
        res.json(school);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update school
router.put('/schools/:id', async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        const school = await prisma.school.update({
            where: { id: parseInt(req.params.id) },
            data: { name, phone, address }
        });
        res.json(school);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
