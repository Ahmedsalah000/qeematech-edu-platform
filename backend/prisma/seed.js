import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Hash default passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    // Create a default school/admin
    const school = await prisma.school.upsert({
        where: { email: 'admin@qeematech.com' },
        update: {},
        create: {
            name: 'Qeematech Academy',
            email: 'admin@qeematech.com',
            password: adminPassword,
            phone: '+20 123 456 7890',
            address: 'Cairo, Egypt'
        }
    });

    console.log('✅ Created school:', school.name);
    console.log('   Admin Login: admin@qeematech.com / admin123');

    // Create sample lessons
    const lessons = [
        {
            name: 'Introduction to Mathematics',
            description: 'Learn the fundamentals of mathematics including algebra, geometry, and calculus basics.',
            rating: 4.8,
            schoolId: school.id
        },
        {
            name: 'English Grammar Essentials',
            description: 'Master English grammar with comprehensive lessons on tenses, sentence structure, and punctuation.',
            rating: 4.5,
            schoolId: school.id
        },
        {
            name: 'Science Fundamentals',
            description: 'Explore the basics of physics, chemistry, and biology in this introductory course.',
            rating: 4.7,
            schoolId: school.id
        },
        {
            name: 'History of Ancient Egypt',
            description: 'Discover the fascinating history of ancient Egyptian civilization, pharaohs, and pyramids.',
            rating: 4.9,
            schoolId: school.id
        },
        {
            name: 'Introduction to Programming',
            description: 'Learn the basics of programming with practical examples and hands-on exercises.',
            rating: 4.6,
            schoolId: school.id
        }
    ];

    for (const lesson of lessons) {
        await prisma.lesson.upsert({
            where: { id: lessons.indexOf(lesson) + 1 },
            update: lesson,
            create: lesson
        });
    }

    console.log('✅ Created', lessons.length, 'sample lessons');

    // Create a sample student
    const student = await prisma.student.upsert({
        where: { email: 'student@qeematech.com' },
        update: {},
        create: {
            name: 'Ahmed Student',
            email: 'student@qeematech.com',
            password: studentPassword,
            phone: '+20 111 222 3333',
            class: 'Grade 10',
            academicYear: '2024-2025',
            schoolId: school.id
        }
    });

    console.log('✅ Created student:', student.name);
    console.log('   Student Login: student@qeematech.com / student123');

    console.log('\n🎉 Seeding completed!');
    console.log('\n📝 Test Accounts:');
    console.log('   Admin:   admin@qeematech.com / admin123');
    console.log('   Student: student@qeematech.com / student123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
