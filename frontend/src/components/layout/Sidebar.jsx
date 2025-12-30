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
    X,
    ChevronRight
} from 'lucide-react'

const Sidebar = ({ type = 'student', isOpen = false, onClose }) => {
    const location = useLocation()
    const { user, logout } = useAuth()

    const studentLinks = [
        { to: '/student/lessons', icon: BookOpen, label: 'Lessons', color: 'from-blue-500 to-cyan-500' },
        { to: '/student/favorites', icon: Heart, label: 'Favorites', color: 'from-pink-500 to-rose-500' },
        { to: '/student/profile', icon: User, label: 'Profile', color: 'from-purple-500 to-indigo-500' },
    ]

    const adminLinks = [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true, color: 'from-emerald-500 to-teal-500' },
        { to: '/admin/students', icon: Users, label: 'Students', color: 'from-orange-500 to-amber-500' },
        { to: '/admin/lessons', icon: BookOpen, label: 'Lessons', color: 'from-blue-500 to-cyan-500' },
        { to: '/admin/profile', icon: School, label: 'School Profile', color: 'from-violet-500 to-purple-500' },
    ]

    const links = type === 'admin' ? adminLinks : studentLinks

    const handleLogout = async () => {
        await logout()
        window.location.href = '/auth'
    }

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`w-72 h-screen bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)] border-r border-[var(--border-color)]/50 flex flex-col fixed md:sticky md:top-0 left-0 top-0 z-40 transform transition-all duration-300 ease-out md:translate-x-0 shadow-2xl ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo Section with Glass Effect */}
                <div className="p-6 pb-5 relative">
                    <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl blur-md opacity-50"></div>
                                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg">
                                    <GraduationCap size={26} className="text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="font-bold text-xl text-[var(--text-primary)] leading-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text">
                                    Qeematech
                                </h1>
                                <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                                    {type === 'admin' ? 'Admin Panel' : ' Student Portal'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="ml-auto md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 p-2 rounded-lg transition-all"
                                aria-label="Close sidebar"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-2 mb-1">
                        Navigation
                    </p>
                    {links.map((link) => {
                        const isActive = link.exact
                            ? location.pathname === link.to
                            : location.pathname.startsWith(link.to)

                        return (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => onClose?.()}
                                className="group relative block"
                            >
                                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg scale-[1.02]'
                                        : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                                }`}>
                                    {/* Icon with glow effect when active */}
                                    <div className={`relative ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                                        {isActive && (
                                            <div className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-lg blur-md opacity-50`}></div>
                                        )}
                                        <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center ${
                                            isActive 
                                                ? 'bg-white/20' 
                                                : 'bg-gradient-to-br from-white/5 to-transparent group-hover:from-white/10'
                                        }`}>
                                            <link.icon size={18} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    
                                    <span className="font-semibold text-sm flex-1">{link.label}</span>
                                    
                                    {/* Arrow indicator */}
                                    <ChevronRight 
                                        size={16} 
                                        className={`transition-all duration-300 ${
                                            isActive 
                                                ? 'opacity-100 translate-x-0' 
                                                : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                                        }`}
                                    />
                                </div>

                                {/* Active indicator bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                                )}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* User Info & Logout Section */}
                <div className="p-4 space-y-3">
                    {/* User Card */}
                    <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary)]/20 to-transparent rounded-full blur-2xl"></div>
                        
                        <div className="relative flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full blur-md opacity-50"></div>
                                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[var(--text-primary)] truncate text-sm">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20"
                    >
                        <div className="w-9 h-9 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 flex items-center justify-center transition-all">
                            <LogOut size={18} strokeWidth={2.5} />
                        </div>
                        <span className="font-semibold text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--text-muted);
                }
            `}</style>
        </>
    )
}

export default Sidebar