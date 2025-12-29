import { Heart } from 'lucide-react'
import Card from '../ui/Card'
import Rating from '../ui/Rating'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

const LessonCard = ({
    lesson,
    onToggleFavorite,
    showFavorite = true,
    isLoading = false
}) => {
    const imageUrl = lesson.image
        ? (lesson.image.startsWith('http') ? lesson.image : `${API_URL}${lesson.image}`)
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'

    return (
        <Card className="overflow-hidden group">
            {/* Image */}
            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={lesson.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 to-transparent" />

                {/* Favorite Button */}
                {showFavorite && (
                    <button
                        onClick={() => onToggleFavorite?.(lesson)}
                        disabled={isLoading}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${lesson.isFavorite
                            ? 'bg-red-500/80 text-white'
                            : 'bg-black/30 text-white hover:bg-red-500/80'
                            }`}
                    >
                        <Heart size={18} fill={lesson.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                )}

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3">
                    <Rating value={lesson.rating} size={14} />
                </div>
            </div>

            {/* Content */}
            <div>
                <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2 line-clamp-1">
                    {lesson.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                    {lesson.description || 'No description available.'}
                </p>
            </div>
        </Card>
    )
}

export default LessonCard
