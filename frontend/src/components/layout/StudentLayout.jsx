import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

const StudentLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen md:flex md:gap-6">
            {isSidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close sidebar overlay"
                />
            )}

            <Sidebar
                type="student"
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="min-h-screen flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="md:hidden mb-4">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            aria-label="Open sidebar"
                        >
                            <Menu size={18} className="shrink-0" />
                            <span className="text-sm">Menu</span>
                        </button>
                    </div>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default StudentLayout
