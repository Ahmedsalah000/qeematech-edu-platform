import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import profileRoutes from './routes/profile.routes.js';
import devRoutes from './routes/dev.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Important for cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/profile', profileRoutes);

// DEV routes (no auth required - for testing)
if (process.env.NODE_ENV === 'development') {
  app.use('/api/dev', devRoutes);
  console.log('⚠️  DEV routes enabled at /api/dev');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Qeematech API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
