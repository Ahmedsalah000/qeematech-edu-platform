import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ChevronRight, Menu } from 'lucide-react'
import Sidebar from './Sidebar'

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const location = useLocation()

    const pathname = location.pathname
    const pageTitle = pathname === '/admin'
        ? 'Dashboard'
        : pathname.startsWith('/admin/students')
            ? 'Students'
            : pathname.startsWith('/admin/lessons')
                ? 'Lessons'
                : pathname.startsWith('/admin/profile')
                    ? 'School Profile'
                    : 'Admin'

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
                type="admin"
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="min-h-screen flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                <div className="w-full max-w-7xl mx-auto">
                    <header className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-6 bg-[var(--bg-primary)]/80 backdrop-blur border-b border-[var(--border-color)]">
                        <div className="flex items-center justify-between gap-3 min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                                <button
                                    type="button"
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="inline-flex md:hidden items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    aria-label="Open sidebar"
                                >
                                    <Menu size={18} className="shrink-0" />
                                    <span className="text-sm">Menu</span>
                                </button>

                                <nav className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)] min-w-0">
                                    <span className="truncate">Admin</span>
                                    <ChevronRight size={16} className="shrink-0" />
                                    <span className="text-[var(--text-primary)] font-medium truncate">{pageTitle}</span>
                                </nav>
                            </div>
                        </div>
                    </header>

                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout
