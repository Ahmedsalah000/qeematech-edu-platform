import { Star } from 'lucide-react'

const Rating = ({ value = 0, max = 5, size = 16 }) => {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }, (_, i) => (
                <Star
                    key={i}
                    size={size}
                    className={`star ${i < Math.round(value) ? 'filled' : ''}`}
                    fill={i < Math.round(value) ? '#fbbf24' : 'none'}
                />
            ))}
            <span className="ml-1 text-sm text-[var(--text-secondary)]">
                {value.toFixed(1)}
            </span>
        </div>
    )
}

export default Rating
