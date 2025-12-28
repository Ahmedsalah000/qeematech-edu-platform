import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    BookOpen,
    Heart,
    User,
    LayoutDashboard,
    Users,
    GraduationCap,
    LogOut,
    School,
    X
} from 'lucide-react'

const Sidebar = ({ type = 'student', isOpen = false, onClose }) => {
    const location = useLocation()
    const { user, logout } = useAuth()

    const studentLinks = [
        { to: '/student/lessons', icon: BookOpen, label: 'Lessons' },
        { to: '/student/favorites', icon: Heart, label: 'Favorites' },
        { to: '/student/profile', icon: User, label: 'Profile' },
    ]

    const adminLinks = [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { to: '/admin/students', icon: Users, label: 'Students' },
        { to: '/admin/lessons', icon: BookOpen, label: 'Lessons' },
        { to: '/admin/profile', icon: School, label: 'School Profile' },
    ]

    const links = type === 'admin' ? adminLinks : studentLinks

    const handleLogout = async () => {
        await logout()
        window.location.href = '/auth'
    }

    return (
        <aside
            className={`w-64 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col fixed md:sticky md:top-0 md:rounded-2xl left-0 top-0 z-40 transform transition-transform duration-200 md:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            {/* Logo */}
            <div className="p-6 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                        <GraduationCap size={24} className="text-white" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-bold text-[var(--text-primary)]">Qeematech</h1>
                        <p className="text-xs text-[var(--text-muted)]">
                            {type === 'admin' ? 'Admin Panel' : 'Student Portal'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-auto md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const isActive = link.exact
                        ? location.pathname === link.to
                        : location.pathname.startsWith(link.to)

                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => onClose?.()}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 min-w-0 ${isActive
                                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-[var(--shadow-glow)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <link.icon size={20} className="shrink-0" />
                            <span className="font-medium truncate">{link.label}</span>
                        </NavLink>
                    )
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--text-primary)] truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                    <LogOut size={18} className="shrink-0" />
                    <span className="truncate">Logout</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
