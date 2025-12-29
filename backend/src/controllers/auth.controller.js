import bcrypt from 'bcrypt';
import prisma from '../utils/prisma.js';
import { generateTokens, cookieOptions, accessTokenOptions, verifyRefreshToken } from '../middleware/auth.middleware.js';

/**
 * Helper to store refresh token in database
 */
const storeRefreshToken = async (userId, userType, token) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    return await prisma.refreshToken.create({
        data: {
            token,
            userId,
            userType,
            expiresAt
        }
    });
};

/**
 * Register a new student
 */
export const registerStudent = async (req, res) => {
    try {
        const { name, email, password, phone, class: studentClass, academicYear, schoolId } = req.body;

        const existingStudent = await prisma.student.findUnique({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const school = await prisma.school.findUnique({ where: { id: parseInt(schoolId) } });
        if (!school) {
            return res.status(400).json({ error: 'School not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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

        const { accessToken, refreshToken } = generateTokens(student.id, 'student');
        await storeRefreshToken(student.id, 'student', refreshToken);

        res.cookie('token', accessToken, accessTokenOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        const { password: _, ...studentData } = student;
        res.status(201).json({ message: 'Registration successful', user: studentData });
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

        const student = await prisma.student.findUnique({
            where: { email },
            include: { school: { select: { id: true, name: true } } }
        });

        if (!student || !(await bcrypt.compare(password, student.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const { accessToken, refreshToken } = generateTokens(student.id, 'student');
        await storeRefreshToken(student.id, 'student', refreshToken);

        res.cookie('token', accessToken, accessTokenOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        const { password: _, ...studentData } = student;
        res.json({ message: 'Login successful', user: studentData });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * Login admin
 */
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const school = await prisma.school.findUnique({ where: { email } });
        if (!school || !(await bcrypt.compare(password, school.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const { accessToken, refreshToken } = generateTokens(school.id, 'admin');
        await storeRefreshToken(school.id, 'admin', refreshToken);

        res.cookie('token', accessToken, accessTokenOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        const { password: _, ...schoolData } = school;
        res.json({ message: 'Login successful', user: schoolData });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * Refresh Token Rotation
 */
export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

    try {
        const tokenDoc = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });

        if (!tokenDoc || tokenDoc.revoked || new Date() > tokenDoc.expiresAt) {
            // If reusing a revoked token, this is an attack -> Revoke all tokens for this user
            if (tokenDoc) {
                await prisma.refreshToken.updateMany({
                    where: { userId: tokenDoc.userId, userType: tokenDoc.userType },
                    data: { revoked: true }
                });
            }
            res.clearCookie('token', accessTokenOptions);
            res.clearCookie('refreshToken', cookieOptions);
            return res.status(401).json({ error: 'Invalid/Revoked session' });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) return res.status(401).json({ error: 'Invalid token' });

        // Generate new pair
        const tokens = generateTokens(decoded.id, decoded.type);

        // Revoke old and store new link (Rotation)
        await prisma.refreshToken.update({
            where: { id: tokenDoc.id },
            data: { revoked: true, replacedBy: tokens.refreshToken }
        });
        await storeRefreshToken(decoded.id, decoded.type, tokens.refreshToken);

        res.cookie('token', tokens.accessToken, accessTokenOptions);
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

        res.json({ message: 'Token refreshed' });
    } catch (error) {
        console.error('Refresh error:', error);
        res.status(500).json({ error: 'Refresh failed' });
    }
};

/**
 * Logout
 */
export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        await prisma.refreshToken.updateMany({
            where: { token: refreshToken },
            data: { revoked: true }
        });
    }
    res.clearCookie('token', accessTokenOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.json({ message: 'Logged out' });
};

/**
 * Logout All Sessions
 */
export const logoutAll = async (req, res) => {
    try {
        await prisma.refreshToken.updateMany({
            where: { userId: req.userId, userType: req.userType },
            data: { revoked: true }
        });
        res.clearCookie('token', accessTokenOptions);
        res.clearCookie('refreshToken', cookieOptions);
        res.json({ message: 'All sessions logged out' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout all' });
    }
};

// ... existing getMe and getSchools remain same logic, can use req.userId/type
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
            const school = await prisma.school.findUnique({ where: { id: req.userId } });
            if (!school) return res.status(404).json({ error: 'User not found' });
            const { password: _, ...data } = school;
            return res.json({ type: 'admin', user: data });
        }
        res.status(400).json({ error: 'Invalid user type' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user' });
    }
};

export const getSchools = async (req, res) => {
    try {
        const schools = await prisma.school.findMany({ select: { id: true, name: true, logo: true } });
        res.json(schools);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
};
