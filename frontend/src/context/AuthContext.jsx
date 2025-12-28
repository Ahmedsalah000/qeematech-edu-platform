import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [userType, setUserType] = useState(null) // 'student' or 'admin'
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const res = await authAPI.getMe()
            setUser(res.data.user)
            setUserType(res.data.type)
            setIsAuthenticated(true)
        } catch (error) {
            setUser(null)
            setUserType(null)
            setIsAuthenticated(false)
        } finally {
            setIsLoading(false)
        }
    }

    const loginStudent = async (email, password) => {
        const res = await authAPI.loginStudent({ email, password })
        setUser(res.data.user)
        setUserType('student')
        setIsAuthenticated(true)
        return res.data
    }

    const loginAdmin = async (email, password) => {
        const res = await authAPI.loginAdmin({ email, password })
        setUser(res.data.user)
        setUserType('admin')
        setIsAuthenticated(true)
        return res.data
    }

    const registerStudent = async (data) => {
        const res = await authAPI.registerStudent(data)
        setUser(res.data.user)
        setUserType('student')
        setIsAuthenticated(true)
        return res.data
    }

    const logout = async () => {
        try {
            await authAPI.logout()
        } catch (error) {
            console.error('Logout error:', error)
        }
        setUser(null)
        setUserType(null)
        setIsAuthenticated(false)
    }

    const value = {
        user,
        userType,
        isLoading,
        isAuthenticated,
        loginStudent,
        loginAdmin,
        registerStudent,
        logout,
        checkAuth
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
