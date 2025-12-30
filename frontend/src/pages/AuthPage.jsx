import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { GraduationCap, School, Mail, Lock, User, Phone, Calendar, BookOpen, ArrowLeft, Sparkles, Users, Trophy } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

const getImageUrl = (path) => {
    if (!path) return null;
    const sPath = String(path).trim();
    if (sPath.includes('http://') || sPath.includes('https://')) return sPath;
    return `${API_URL}${sPath.startsWith('/') ? sPath : '/' + sPath}`;
}

const AuthPage = () => {
    const navigate = useNavigate()
    const { loginStudent, loginAdmin, registerStudent } = useAuth()
    const [mode, setMode] = useState('choose')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [loginForm, setLoginForm] = useState({ email: '', password: '' })
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        class: '',
        academicYear: '',
        schoolId: ''
    })

    const { data: schools = [] } = useQuery({
        queryKey: ['schools'],
        queryFn: async () => {
            const res = await authAPI.getSchools()
            return res.data
        }
    })

    const handleStudentLogin = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            await loginStudent(loginForm.email, loginForm.password)
            navigate('/student')
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAdminLogin = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            await loginAdmin(loginForm.email, loginForm.password)
            navigate('/admin')
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            await registerStudent(registerForm)
            navigate('/student')
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    // Choose Role Screen
    if (mode === 'choose') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary)]/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--secondary)]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/3 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Logo & Header with Animation */}
                    <div className="text-center mb-10 animate-fade-in">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-3xl blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-[var(--shadow-glow)] transform hover:scale-105 transition-transform duration-300">
                                <BookOpen size={56} className="text-white" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center animate-bounce">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-3 tracking-tight">Qeematech</h1>
                        <p className="text-lg text-[var(--text-secondary)] font-medium">Your Gateway to Knowledge</p>
                    </div>

                    {/* Role Selection Card */}
                    <div className="glass-card p-10 backdrop-blur-xl animate-slide-up">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                                Welcome Back! 👋
                            </h2>
                            <p className="text-[var(--text-secondary)]">Choose your role to continue</p>
                        </div>

                        <div className="space-y-6">
                            {/* Student Button */}
                            <button
                                onClick={() => setMode('student-login')}
                                className="w-full p-7 rounded-2xl bg-gradient-to-r from-[var(--primary)]/10 via-[var(--primary)]/5 to-[var(--secondary)]/10 border-2 border-[var(--border-color)] hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/0 via-[var(--primary)]/5 to-[var(--primary)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="flex items-center gap-6 min-w-0 relative z-10">
                                    <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0 shadow-lg">
                                        <GraduationCap size={36} className="text-white" />
                                    </div>
                                    <div className="text-left min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-xl text-[var(--text-primary)]">Student Portal</h3>
                                            <Users size={18} className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">Access your courses, lessons & track progress</p>
                                    </div>
                                    <div className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <ArrowLeft size={24} className="rotate-180" />
                                    </div>
                                </div>
                            </button>

                            {/* Admin Button */}
                            <button
                                onClick={() => setMode('admin-login')}
                                className="w-full p-7 rounded-2xl bg-gradient-to-r from-[var(--secondary)]/10 via-[var(--secondary)]/5 to-[var(--accent)]/10 border-2 border-[var(--border-color)] hover:border-[var(--secondary)] hover:shadow-lg hover:shadow-[var(--secondary)]/20 transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--secondary)]/0 via-[var(--secondary)]/5 to-[var(--secondary)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="flex items-center gap-6 min-w-0 relative z-10">
                                    <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0 shadow-lg">
                                        <School size={36} className="text-white" />
                                    </div>
                                    <div className="text-left min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-xl text-[var(--text-primary)]">Admin Portal</h3>
                                            <Trophy size={18} className="text-[var(--secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">Manage school, students & educational content</p>
                                    </div>
                                    <div className="text-[var(--secondary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <ArrowLeft size={24} className="rotate-180" />
                                    </div>
                                </div>
                            </button>
                        </div>

  
                    </div>

    
                </div>

                <style jsx>{`
                    @keyframes fade-in {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes slide-up {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.6s ease-out;
                    }
                    .animate-slide-up {
                        animation: slide-up 0.6s ease-out 0.2s both;
                    }
                    .delay-500 {
                        animation-delay: 0.5s;
                    }
                    .delay-1000 {
                        animation-delay: 1s;
                    }
                `}</style>
            </div>
        )
    }

    // Student Login Screen
    if (mode === 'student-login') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary)]/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--secondary)]/5 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Back Button */}
                    <button
                        onClick={() => { setMode('choose'); setError(''); setLoginForm({ email: '', password: '' }); }}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] mb-6 transition-all hover:gap-3 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Role Selection</span>
                    </button>

                    {/* Login Card */}
                    <div className="glass-card p-10 backdrop-blur-xl">
                        <div className="text-center mb-10">
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl blur-lg opacity-50"></div>
                                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg">
                                    <GraduationCap size={44} className="text-white" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">Welcome Back!</h2>
                            <p className="text-[var(--text-secondary)] text-base">Sign in to continue your learning journey</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border-2 border-red-500/30 text-red-400 px-5 py-4 rounded-xl mb-8 text-sm flex items-center gap-3 animate-shake">
                                <span className="text-xl">⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleStudentLogin} className="space-y-6">
                            <Input
                                label="Email Address"
                                type="email"
                                icon={Mail}
                                placeholder="your@email.com"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                icon={Lock}
                                placeholder="Enter your password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                required
                            />
                            
                            <Button type="submit" className="w-full mt-10" isLoading={isLoading}>
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-10 text-center">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[var(--border-color)]"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[var(--bg-card)] text-[var(--text-muted)]">New to Qeematech?</span>
                                </div>
                            </div>
                            <button
                                onClick={() => { setMode('student-register'); setError(''); }}
                                className="mt-6 text-[var(--primary)] hover:text-[var(--primary)]/80 font-semibold text-lg hover:underline transition-all"
                            >
                                Create Account →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Student Register Screen
    if (mode === 'student-register') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 py-8 relative overflow-hidden bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary)]/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--secondary)]/5 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Back Button */}
                    <button
                        onClick={() => { setMode('student-login'); setError(''); }}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] mb-6 transition-all hover:gap-3 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Login</span>
                    </button>

                    {/* Register Card */}
                    <div className="glass-card p-8 sm:p-10 backdrop-blur-xl">
                        <div className="text-center mb-8">
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl blur-lg opacity-50"></div>
                                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg">
                                    <GraduationCap size={44} className="text-white" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">Join Qeematech</h2>
                            <p className="text-[var(--text-secondary)] text-base">Start your learning adventure today</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border-2 border-red-500/30 text-red-400 px-5 py-4 rounded-xl mb-8 text-sm flex items-center gap-3">
                                <span className="text-xl">⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-5">
                            <Input
                                label="Full Name"
                                icon={User}
                                placeholder="Enter your full name"
                                value={registerForm.name}
                                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                icon={Mail}
                                placeholder="your@email.com"
                                value={registerForm.email}
                                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                icon={Lock}
                                placeholder="Minimum 6 characters"
                                value={registerForm.password}
                                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                required
                            />
                            <Input
                                label="Phone Number (Optional)"
                                icon={Phone}
                                placeholder="+20 xxx xxx xxxx"
                                value={registerForm.phone}
                                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Input
                                    label="Class/Grade"
                                    icon={GraduationCap}
                                    placeholder="e.g., Grade 10"
                                    value={registerForm.class}
                                    onChange={(e) => setRegisterForm({ ...registerForm, class: e.target.value })}
                                />
                                <Input
                                    label="Academic Year"
                                    icon={Calendar}
                                    placeholder="2024-2025"
                                    value={registerForm.academicYear}
                                    onChange={(e) => setRegisterForm({ ...registerForm, academicYear: e.target.value })}
                                />
                            </div>
                            <div className="mt-2">
                                <label className="label font-medium text-[var(--text-primary)] mb-3 block">
                                    Select Your School
                                </label>
                                <select
                                    className="input w-full"
                                    value={registerForm.schoolId}
                                    onChange={(e) => setRegisterForm({ ...registerForm, schoolId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose your school...</option>
                                    {schools.map((school) => (
                                        <option key={school.id} value={school.id}>
                                            {school.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full mt-8" isLoading={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-[var(--text-secondary)]">
                                Already have an account?{' '}
                                <button
                                    onClick={() => { setMode('student-login'); setError(''); }}
                                    className="text-[var(--primary)] hover:text-[var(--primary)]/80 font-semibold hover:underline transition-all"
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Admin Login Screen
    if (mode === 'admin-login') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--secondary)]/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Back Button */}
                    <button
                        onClick={() => { setMode('choose'); setError(''); setLoginForm({ email: '', password: '' }); }}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--secondary)] mb-6 transition-all hover:gap-3 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Role Selection</span>
                    </button>

                    {/* Login Card */}
                    <div className="glass-card p-10 backdrop-blur-xl">
                        <div className="text-center mb-10">
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] rounded-2xl blur-lg opacity-50"></div>
                                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] flex items-center justify-center shadow-lg">
                                    <School size={44} className="text-white" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">Admin Portal</h2>
                            <p className="text-[var(--text-secondary)] text-base">School Management Dashboard</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border-2 border-red-500/30 text-red-400 px-5 py-4 rounded-xl mb-8 text-sm flex items-center gap-3">
                                <span className="text-xl">⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAdminLogin} className="space-y-6">
                            <Input
                                label="Admin Email"
                                type="email"
                                icon={Mail}
                                placeholder="admin@school.com"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                icon={Lock}
                                placeholder="Enter your password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                required
                            />
                            
                            <Button type="submit" className="w-full mt-10" isLoading={isLoading}>
                                {isLoading ? 'Signing In...' : 'Sign In as Admin'}
                            </Button>
                        </form>

                        <div className="mt-8 p-6 bg-gradient-to-r from-[var(--secondary)]/5 to-[var(--accent)]/5 rounded-xl border border-[var(--border-color)]">
                            <div className="flex items-start gap-4">
                                <div className="text-3xl shrink-0">🔐</div>
                                <div>
                                    <p className="text-sm text-[var(--text-primary)] font-medium mb-2">Secure Access</p>
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                        Admin accounts are created by system administrators only for authorized school personnel.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default AuthPage