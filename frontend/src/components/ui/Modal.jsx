import { useEffect } from 'react'
import { X } from 'lucide-react'

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) => {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return

        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.()
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose?.()
            }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-none"
            />

            {/* Modal */}
            <div
                className={`relative z-50 w-full ${sizes[size]} card hover:transform-none hover:shadow-none hover:border-[var(--border-color)] animate-fadeIn max-h-[85vh] overflow-hidden pointer-events-auto`}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
                    >
                        <X size={20} className="text-[var(--text-secondary)]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
