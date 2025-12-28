import bcrypt from 'bcrypt';
import prisma from '../utils/prisma.js';
import { generateToken, cookieOptions } from '../middleware/auth.middleware.js';

/**
 * Register a new student
 */
export const registerStudent = async (req, res) => {
    try {
        const { name, email, password, phone, class: studentClass, academicYear, schoolId } = req.body;

        // Validate required fields
        if (!name || !email || !password || !schoolId) {
            return res.status(400).json({ error: 'Name, email, password, and schoolId are required' });
        }

        // Check if email already exists
        const existingStudent = await prisma.student.findUnique({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Check if school exists
        const school = await prisma.school.findUnique({ where: { id: parseInt(schoolId) } });
        if (!school) {
            return res.status(400).json({ error: 'School not found' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student
        const student = await prisma.student.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                class: studentClass,
                academicYear,
                schoolId: parseInt(schoolId)
            }
        });

        // Generate token
        const token = generateToken(student.id, 'student');

        // Set HTTP-only cookie
        res.cookie('token', token, cookieOptions);

        // Remove password from response
        const { password: _, ...studentData } = student;

        res.status(201).json({
            message: 'Registration successful',
            user: studentData
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

/**
 * Login student
 */
export const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find student
        const student = await prisma.student.findUnique({
            where: { email },
            include: { school: { select: { id: true, name: true } } }
        });

        if (!student) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, student.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(student.id, 'student');

        // Set HTTP-only cookie
        res.cookie('token', token, cookieOptions);

        // Remove password from response
        const { password: _, ...studentData } = student;

        res.json({
            message: 'Login successful',
            user: studentData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * Login admin (school)
 */
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find school
        const school = await prisma.school.findUnique({
            where: { email }
        });

        if (!school) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, school.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(school.id, 'admin');

        // Set HTTP-only cookie
        res.cookie('token', token, cookieOptions);

        // Remove password from response
        const { password: _, ...schoolData } = school;

        res.json({
            message: 'Login successful',
            user: schoolData
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * Logout - clear cookie
 */
export const logout = async (req, res) => {
    res.clearCookie('token', cookieOptions);
    res.json({ message: 'Logged out successfully' });
};

/**
 * Get current user info
 */
export const getMe = async (req, res) => {
    try {
        if (req.userType === 'student') {
            const student = await prisma.student.findUnique({
                where: { id: req.userId },
                include: { school: { select: { id: true, name: true } } }
            });

            if (!student) return res.status(404).json({ error: 'User not found' });

            const { password: _, ...data } = student;
            return res.json({ type: 'student', user: data });
        }

        if (req.userType === 'admin') {
            const school = await prisma.school.findUnique({
                where: { id: req.userId }
            });

            if (!school) return res.status(404).json({ error: 'User not found' });

            const { password: _, ...data } = school;
            return res.json({ type: 'admin', user: data });
        }

        res.status(400).json({ error: 'Invalid user type' });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
};

/**
 * Get all schools (for registration dropdown)
 */
export const getSchools = async (req, res) => {
    try {
        const schools = await prisma.school.findMany({
            select: { id: true, name: true, logo: true }
        });
        res.json(schools);
    } catch (error) {
        console.error('Get schools error:', error);
        res.status(500).json({ error: 'Failed to get schools' });
    }
};
