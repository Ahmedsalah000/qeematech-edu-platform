import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { GraduationCap, School, Mail, Lock, User, Phone, Calendar, BookOpen, ArrowLeft } from 'lucide-react'

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
    const [mode, setMode] = useState('choose') // 'choose', 'student-login', 'student-register', 'admin-login'
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Login form state
    const [loginForm, setLoginForm] = useState({ email: '', password: '' })

    // Register form state
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        class: '',
        academicYear: '',
        schoolId: ''
    })

    // Get schools for registration
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
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-glow)]">
                            <BookOpen size={48} className="text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">Qeematech</h1>
                        <p className="text-[var(--text-secondary)]">Educational Platform</p>
                    </div>

                    {/* Role Selection */}
                    <div className="glass-card p-8">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] text-center mb-8">
                            Welcome! Choose Your Role
                        </h2>

                        <div className="space-y-4">
                            {/* Student Button */}
                            <button
                                onClick={() => setMode('student-login')}
                                className="w-full p-6 rounded-2xl bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--border-color)] hover:border-[var(--primary)] transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                        <GraduationCap size={28} className="text-white" />
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h3 className="font-semibold text-lg text-[var(--text-primary)] truncate">Student</h3>
                                        <p className="text-sm text-[var(--text-muted)] truncate">Access lessons & manage favorites</p>
                                    </div>
                                </div>
                            </button>

                            {/* Admin Button */}
                            <button
                                onClick={() => setMode('admin-login')}
                                className="w-full p-6 rounded-2xl bg-gradient-to-r from-[var(--secondary)]/10 to-[var(--accent)]/10 border border-[var(--border-color)] hover:border-[var(--secondary)] transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                        <School size={28} className="text-white" />
                                    </div>
                                    <div className="text-left min-w-0">
                                        <h3 className="font-semibold text-lg text-[var(--text-primary)] truncate">School Admin</h3>
                                        <p className="text-sm text-[var(--text-muted)] truncate">Manage school, students & lessons</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Student Login Screen
    if (mode === 'student-login') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <button
                        onClick={() => { setMode('choose'); setError(''); setLoginForm({ email: '', password: '' }); }}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Role Selection
                    </button>

                    {/* Login Card */}
                    <div className="glass-card p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center mx-auto mb-4">
                                <GraduationCap size={32} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Student Login</h2>
                            <p className="text-[var(--text-secondary)] mt-1">Welcome back!</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleStudentLogin} className="space-y-4">
                            <Input
                                label="Email"
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
                                placeholder="••••••••"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                required
                            />
                            <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-[var(--text-secondary)]">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => { setMode('student-register'); setError(''); }}
                                    className="text-[var(--primary)] hover:underline font-medium"
                                >
                                    Register here
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Student Register Screen
    if (mode === 'student-register') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 py-8">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <button
                        onClick={() => { setMode('student-login'); setError(''); }}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Login
                    </button>

                    {/* Register Card */}
                    <div className="glass-card p-6 sm:p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center mx-auto mb-4">
                                <GraduationCap size={32} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Student Registration</h2>
                            <p className="text-[var(--text-secondary)] mt-1">Create your account</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <Input
                                label="Full Name"
                                icon={User}
                                placeholder="Enter your name"
                                value={registerForm.name}
                                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Email"
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
                                label="Phone (optional)"
                                icon={Phone}
                                placeholder="+20 xxx xxx xxxx"
                                value={registerForm.phone}
                                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Class"
                                    icon={GraduationCap}
                                    placeholder="Grade 10"
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
                            <div>
                                <label className="label">Select School</label>
                                <select
                                    className="input"
                                    value={registerForm.schoolId}
                                    onChange={(e) => setRegisterForm({ ...registerForm, schoolId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose a school...</option>
                                    {schools.map((school) => (
                                        <option key={school.id} value={school.id}>
                                            {school.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                                Create Account
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-[var(--text-secondary)]">
                                Already have an account?{' '}
                                <button
                                    onClick={() => { setMode('student-login'); setError(''); }}
                                    className="text-[var(--primary)] hover:underline font-medium"
                                >
                                    Sign in
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
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <button
                        onClick={() => { setMode('choose'); setError(''); setLoginForm({ email: '', password: '' }); }}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Role Selection
                    </button>

                    {/* Login Card */}
                    <div className="glass-card p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] flex items-center justify-center mx-auto mb-4">
                                <School size={32} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Admin Login</h2>
                            <p className="text-[var(--text-secondary)] mt-1">School Administration Portal</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAdminLogin} className="space-y-4">
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
                                placeholder="••••••••"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                required
                            />
                            <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                                Sign In as Admin
                            </Button>
                        </form>

                        <div className="mt-6 p-4 bg-[var(--bg-card)] rounded-xl">
                            <p className="text-sm text-[var(--text-muted)] text-center">
                                🔐 Admin accounts are created by system administrators only.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default AuthPage
