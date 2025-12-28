import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonsAPI, favoritesAPI } from '../../services/api'
import LessonCard from '../../components/shared/LessonCard'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { BookOpen, Search } from 'lucide-react'

const LessonsPage = () => {
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch lessons
    const { data: lessons = [], isLoading } = useQuery({
        queryKey: ['lessons'],
        queryFn: async () => {
            const res = await lessonsAPI.getAll()
            return res.data
        }
    })

    // Toggle favorite mutation
    const toggleFavorite = useMutation({
        mutationFn: async (lesson) => {
            if (lesson.isFavorite) {
                await favoritesAPI.remove(lesson.id)
            } else {
                await favoritesAPI.add(lesson.id)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] })
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        }
    })

    // Filter lessons by search
    const filteredLessons = lessons.filter(lesson =>
        lesson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3 min-w-0">
                        <BookOpen className="text-[var(--primary)] shrink-0" />
                        All Lessons
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Browse and explore available lessons
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-10"
                    />
                </div>
            </div>

            {/* Lessons Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredLessons.length === 0 ? (
                <div className="text-center py-16">
                    <BookOpen size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                    <h3 className="text-lg font-medium text-[var(--text-primary)]">No lessons found</h3>
                    <p className="text-[var(--text-secondary)]">
                        {searchTerm ? 'Try a different search term' : 'No lessons available yet'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLessons.map((lesson) => (
                        <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            onToggleFavorite={() => toggleFavorite.mutate(lesson)}
                            isLoading={toggleFavorite.isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default LessonsPage
