const Card = ({
    children,
    className = '',
    hover = true,
    glass = false,
    ...props
}) => {
    const baseClasses = glass ? 'glass-card' : 'card'
    const hoverClasses = hover ? '' : 'hover:transform-none hover:shadow-none hover:border-[var(--border-color)]'

    return (
        <div
            className={`${baseClasses} ${hoverClasses} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

export default Card
