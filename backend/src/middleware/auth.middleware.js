import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'qeematech-super-secret-key-2024';

// Cookie options
export const cookieOptions = {
  httpOnly: true,        // Not accessible via JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax',       // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: '/'
};

/**
 * Verify JWT token from cookie or header and attach user to request
 */
export const requireAuth = async (req, res, next) => {
  try {
    // Try to get token from cookie first, then from header
    let token = req.cookies?.token;

    // Fallback to Authorization header (for Postman testing)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;
      req.userType = decoded.type; // 'student' or 'admin'
      next();
    } catch (err) {
      // Clear invalid cookie
      res.clearCookie('token', cookieOptions);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

/**
 * Require admin (school) access
 */
export const requireAdmin = async (req, res, next) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const school = await prisma.school.findUnique({
      where: { id: req.userId }
    });

    if (!school) {
      return res.status(403).json({ error: 'Admin not found' });
    }

    req.school = school;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

/**
 * Require student access
 */
export const requireStudent = async (req, res, next) => {
  try {
    if (req.userType !== 'student') {
      return res.status(403).json({ error: 'Student access required' });
    }

    const student = await prisma.student.findUnique({
      where: { id: req.userId },
      include: { school: true }
    });

    if (!student) {
      return res.status(403).json({ error: 'Student not found' });
    }

    req.student = student;
    next();
  } catch (error) {
    console.error('Student auth error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

/**
 * Check if user is admin OR student (for shared routes)
 */
export const requireAdminOrStudent = async (req, res, next) => {
  try {
    if (req.userType === 'admin') {
      const school = await prisma.school.findUnique({
        where: { id: req.userId }
      });
      if (school) {
        req.school = school;
        return next();
      }
    } else if (req.userType === 'student') {
      const student = await prisma.student.findUnique({
        where: { id: req.userId },
        include: { school: true }
      });
      if (student) {
        req.student = student;
        return next();
      }
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (id, type) => {
  return jwt.sign({ id, type }, JWT_SECRET, { expiresIn: '7d' });
};
