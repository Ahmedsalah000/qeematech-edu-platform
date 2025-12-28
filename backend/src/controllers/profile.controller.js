import prisma from '../utils/prisma.js';

/**
 * Get profile (student or admin)
 */
export const getProfile = async (req, res) => {
    try {
        if (req.userType === 'student') {
            const student = await prisma.student.findUnique({
                where: { id: req.userId },
                include: { school: { select: { id: true, name: true } } }
            });

            if (!student) return res.status(404).json({ error: 'User not found' });

            const { password: _, ...data } = student;
            return res.json({ type: 'student', ...data });
        }

        if (req.userType === 'admin') {
            const school = await prisma.school.findUnique({
                where: { id: req.userId },
                include: {
                    _count: { select: { students: true, lessons: true } }
                }
            });

            if (!school) return res.status(404).json({ error: 'User not found' });

            const { password: _, ...data } = school;
            return res.json({ type: 'admin', ...data });
        }

        res.status(400).json({ error: 'Invalid user type' });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};

/**
 * Update student profile
 */
export const updateStudentProfile = async (req, res) => {
    try {
        const { name, phone, class: studentClass, academicYear } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (studentClass) updateData.class = studentClass;
        if (academicYear) updateData.academicYear = academicYear;
        if (req.file) updateData.profileImage = `/uploads/${req.file.filename}`;

        const student = await prisma.student.update({
            where: { id: req.student.id },
            data: updateData
        });

        const { password: _, ...data } = student;
        res.json(data);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

/**
 * Update school profile (Admin)
 */
export const updateSchoolProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (req.file) updateData.logo = `/uploads/${req.file.filename}`;

        const school = await prisma.school.update({
            where: { id: req.school.id },
            data: updateData
        });

        const { password: _, ...data } = school;
        res.json(data);
    } catch (error) {
        console.error('Update school profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
