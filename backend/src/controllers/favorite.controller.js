import prisma from '../utils/prisma.js';

/**
 * Get all favorites for current student
 */
export const getFavorites = async (req, res) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { studentId: req.student.id },
            include: { lesson: true },
            orderBy: { createdAt: 'desc' }
        });

        const lessons = favorites.map(f => ({
            ...f.lesson,
            isFavorite: true,
            favoriteId: f.id
        }));

        res.json(lessons);
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'Failed to get favorites' });
    }
};

/**
 * Add lesson to favorites
 */
export const addFavorite = async (req, res) => {
    try {
        const lessonId = parseInt(req.params.lessonId);

        // Check if lesson exists and belongs to student's school
        const lesson = await prisma.lesson.findFirst({
            where: { id: lessonId, schoolId: req.student.schoolId }
        });

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        // Check if already in favorites
        const existing = await prisma.favorite.findUnique({
            where: {
                studentId_lessonId: {
                    studentId: req.student.id,
                    lessonId
                }
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'Lesson already in favorites' });
        }

        const favorite = await prisma.favorite.create({
            data: {
                studentId: req.student.id,
                lessonId
            },
            include: { lesson: true }
        });

        res.status(201).json(favorite);
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
};

/**
 * Remove lesson from favorites
 */
export const removeFavorite = async (req, res) => {
    try {
        const lessonId = parseInt(req.params.lessonId);

        const favorite = await prisma.favorite.findUnique({
            where: {
                studentId_lessonId: {
                    studentId: req.student.id,
                    lessonId
                }
            }
        });

        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        await prisma.favorite.delete({
            where: { id: favorite.id }
        });

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
};
