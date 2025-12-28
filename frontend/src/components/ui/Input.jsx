import { forwardRef } from 'react'

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="label">{label}</label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`input ${Icon ? 'pl-10' : ''} ${error ? 'border-[var(--error)] focus:border-[var(--error)]' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-[var(--error)]">{error}</p>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
