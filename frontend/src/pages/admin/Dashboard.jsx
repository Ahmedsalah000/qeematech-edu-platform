import { useQuery } from '@tanstack/react-query'
import { studentsAPI, lessonsAPI } from '../../services/api'
import Card from '../../components/ui/Card'
import { Users, BookOpen, TrendingUp } from 'lucide-react'

const Dashboard = () => {
    // Fetch students
    const { data: students = [] } = useQuery({
        queryKey: ['students'],
        queryFn: async () => {
            const res = await studentsAPI.getAll()
            return res.data
        }
    })

    // Fetch lessons
    const { data: lessons = [] } = useQuery({
        queryKey: ['adminLessons'],
        queryFn: async () => {
            const res = await lessonsAPI.getAll()
            return res.data
        }
    })

    const stats = [
        {
            title: 'Total Students',
            value: students.length,
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Total Lessons',
            value: lessons.length,
            icon: BookOpen,
            color: 'from-purple-500 to-pink-500',
        },
        {
            title: 'Avg. Rating',
            value: lessons.length > 0
                ? (lessons.reduce((acc, l) => acc + l.rating, 0) / lessons.length).toFixed(1)
                : '0.0',
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-500',
        },
    ]

    return (
        <div className="animate-fadeIn">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">
                Dashboard Overview
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.title} className="relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm">{stat.title}</p>
                                <p className="text-3xl font-bold text-[var(--text-primary)] mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon size={28} className="text-white" />
                            </div>
                        </div>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                    </Card>
                ))}
            </div>

            {/* Recent Students */}
            <Card hover={false} className="mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Students</h2>
                {students.length === 0 ? (
                    <p className="text-[var(--text-secondary)]">No students yet</p>
                ) : (
                    <div className="space-y-3">
                        {students.slice(0, 5).map((student) => (
                            <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] min-w-0">
                                <div className="w-10 h-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center shrink-0">
                                    <Users size={18} className="text-[var(--text-muted)]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-[var(--text-primary)] truncate">{student.name}</p>
                                    <p className="text-sm text-[var(--text-muted)] truncate">{student.email}</p>
                                </div>
                                <span className="ml-auto badge shrink-0">{student.class || 'N/A'}</span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Recent Lessons */}
            <Card hover={false}>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Lessons</h2>
                {lessons.length === 0 ? (
                    <p className="text-[var(--text-secondary)]">No lessons yet</p>
                ) : (
                    <div className="space-y-3">
                        {lessons.slice(0, 5).map((lesson) => (
                            <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] min-w-0">
                                <div className="w-10 h-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center shrink-0">
                                    <BookOpen size={18} className="text-[var(--text-muted)]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-[var(--text-primary)] truncate">{lesson.name}</p>
                                    <p className="text-sm text-[var(--text-muted)] line-clamp-1">{lesson.description}</p>
                                </div>
                                <span className="ml-auto badge badge-success shrink-0">★ {lesson.rating}</span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}

export default Dashboard
