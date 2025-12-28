import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { favoritesAPI } from '../../services/api'
import LessonCard from '../../components/shared/LessonCard'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { Heart } from 'lucide-react'

const FavoritesPage = () => {
    const queryClient = useQueryClient()

    // Fetch favorites
    const { data: favorites = [], isLoading } = useQuery({
        queryKey: ['favorites'],
        queryFn: async () => {
            const res = await favoritesAPI.getAll()
            return res.data
        }
    })

    // Remove favorite mutation
    const removeFavorite = useMutation({
        mutationFn: (lessonId) => favoritesAPI.remove(lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
            queryClient.invalidateQueries({ queryKey: ['lessons'] })
        }
    })

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                    <Heart className="text-red-500" fill="currentColor" />
                    My Favorites
                </h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    Lessons you've saved for later
                </p>
            </div>

            {/* Favorites Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-16">
                    <Heart size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                    <h3 className="text-lg font-medium text-[var(--text-primary)]">No favorites yet</h3>
                    <p className="text-[var(--text-secondary)]">
                        Start adding lessons to your favorites!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((lesson) => (
                        <LessonCard
                            key={lesson.id}
                            lesson={{ ...lesson, isFavorite: true }}
                            onToggleFavorite={() => removeFavorite.mutate(lesson.id)}
                            isLoading={removeFavorite.isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default FavoritesPage
