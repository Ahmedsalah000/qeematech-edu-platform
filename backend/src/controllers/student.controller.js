import prisma from '../utils/prisma.js';

/**
 * Get all students (Admin only)
 */
export const getAllStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            where: { schoolId: req.school.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                profileImage: true,
                class: true,
                academicYear: true,
                createdAt: true
            }
        });
        res.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Failed to get students' });
    }
};

/**
 * Get single student (Admin only)
 */
export const getStudentById = async (req, res) => {
    try {
        const student = await prisma.student.findFirst({
            where: {
                id: parseInt(req.params.id),
                schoolId: req.school.id
            },
            include: { school: { select: { id: true, name: true } } }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const { password: _, ...data } = student;
        res.json(data);
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({ error: 'Failed to get student' });
    }
};

/**
 * Create student (Admin only)
 */
export const createStudent = async (req, res) => {
    try {
        const { name, email, password, phone, class: studentClass, academicYear } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Check if email exists
        const existingStudent = await prisma.student.findUnique({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const bcrypt = await import('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await prisma.student.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                class: studentClass,
                academicYear,
                schoolId: req.school.id,
                profileImage: req.file ? `/uploads/${req.file.filename}` : null
            }
        });

        const { password: _, ...data } = student;
        res.status(201).json(data);
    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({ error: 'Failed to create student' });
    }
};

/**
 * Update student (Admin only)
 */
export const updateStudent = async (req, res) => {
    try {
        const { name, phone, class: studentClass, academicYear } = req.body;

        // Check student exists and belongs to school
        const existing = await prisma.student.findFirst({
            where: { id: parseInt(req.params.id), schoolId: req.school.id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (studentClass) updateData.class = studentClass;
        if (academicYear) updateData.academicYear = academicYear;
        if (req.file) updateData.profileImage = `/uploads/${req.file.filename}`;

        const student = await prisma.student.update({
            where: { id: parseInt(req.params.id) },
            data: updateData
        });

        const { password: _, ...data } = student;
        res.json(data);
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({ error: 'Failed to update student' });
    }
};

/**
 * Delete student (Admin only)
 */
export const deleteStudent = async (req, res) => {
    try {
        // Check student exists and belongs to school
        const existing = await prisma.student.findFirst({
            where: { id: parseInt(req.params.id), schoolId: req.school.id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Student not found' });
        }

        await prisma.student.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ error: 'Failed to delete student' });
    }
};
