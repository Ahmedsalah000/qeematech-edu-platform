import { Router } from 'express';
import {
    getFavorites,
    addFavorite,
    removeFavorite
} from '../controllers/favorite.controller.js';
import { requireAuth, requireStudent } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require student auth
router.use(requireAuth, requireStudent);

router.get('/', getFavorites);
router.post('/:lessonId', addFavorite);
router.delete('/:lessonId', removeFavorite);

export default router;
