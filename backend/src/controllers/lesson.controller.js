import prisma from '../utils/prisma.js';

/**
 * Get all lessons
 */
export const getAllLessons = async (req, res) => {
    try {
        // Get schoolId from either admin or student
        const schoolId = req.school?.id || req.student?.schoolId;

        if (!schoolId) {
            return res.status(400).json({ error: 'School context required' });
        }

        const lessons = await prisma.lesson.findMany({
            where: { schoolId },
            orderBy: { createdAt: 'desc' }
        });

        // If student, include favorite status
        if (req.student) {
            const favorites = await prisma.favorite.findMany({
                where: { studentId: req.student.id },
                select: { lessonId: true }
            });
            const favoriteIds = new Set(favorites.map(f => f.lessonId));

            const lessonsWithFavorites = lessons.map(lesson => ({
                ...lesson,
                isFavorite: favoriteIds.has(lesson.id)
            }));

            return res.json(lessonsWithFavorites);
        }

        res.json(lessons);
    } catch (error) {
        console.error('Get lessons error:', error);
        res.status(500).json({ error: 'Failed to get lessons' });
    }
};

/**
 * Get single lesson
 */
export const getLessonById = async (req, res) => {
    try {
        const schoolId = req.school?.id || req.student?.schoolId;

        const lesson = await prisma.lesson.findFirst({
            where: {
                id: parseInt(req.params.id),
                schoolId
            }
        });

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        res.json(lesson);
    } catch (error) {
        console.error('Get lesson error:', error);
        res.status(500).json({ error: 'Failed to get lesson' });
    }
};

/**
 * Create lesson (Admin only)
 */
export const createLesson = async (req, res) => {
    try {
        const { name, description, rating } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Lesson name is required' });
        }

        const lesson = await prisma.lesson.create({
            data: {
                name,
                description,
                rating: parseFloat(rating) || 0,
                schoolId: req.school.id,
                image: req.file ? `/uploads/${req.file.filename}` : null
            }
        });

        res.status(201).json(lesson);
    } catch (error) {
        console.error('Create lesson error:', error);
        res.status(500).json({ error: 'Failed to create lesson' });
    }
};

/**
 * Update lesson (Admin only)
 */
export const updateLesson = async (req, res) => {
    try {
        const { name, description, rating } = req.body;
        const lessonId = parseInt(req.params.id);

        if (isNaN(lessonId)) {
            return res.status(400).json({ error: 'Invalid lesson ID' });
        }

        // Check lesson exists and belongs to school
        const existing = await prisma.lesson.findFirst({
            where: { id: lessonId, schoolId: req.school.id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Lesson not found or access denied' });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        // Ensure rating is a valid number
        if (rating !== undefined) {
            const parsedRating = parseFloat(rating);
            if (!isNaN(parsedRating)) {
                updateData.rating = parsedRating;
            }
        }

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const lesson = await prisma.lesson.update({
            where: { id: lessonId },
            data: updateData
        });

        res.json(lesson);
    } catch (error) {
        console.error('Update lesson error details:', {
            message: error.message,
            stack: error.stack,
            body: req.body,
            file: req.file?.filename,
            params: req.params
        });
        res.status(500).json({
            error: 'Failed to update lesson',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
        });
    }
};

/**
 * Delete lesson (Admin only)
 */
export const deleteLesson = async (req, res) => {
    try {
        // Check lesson exists and belongs to school
        const existing = await prisma.lesson.findFirst({
            where: { id: parseInt(req.params.id), schoolId: req.school.id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        await prisma.lesson.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Delete lesson error:', error);
        res.status(500).json({ error: 'Failed to delete lesson' });
    }
};
