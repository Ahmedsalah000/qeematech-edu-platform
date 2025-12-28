import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with credentials for cookies
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for HTTP-only cookies
})

// Auth API
export const authAPI = {
    getSchools: () => api.get('/auth/schools'),
    registerStudent: (data) => api.post('/auth/register/student', data),
    loginStudent: (data) => api.post('/auth/login/student', data),
    loginAdmin: (data) => api.post('/auth/login/admin', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
}

// Students API (Admin)
export const studentsAPI = {
    getAll: () => api.get('/students'),
    getById: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
}

// Lessons API
export const lessonsAPI = {
    getAll: () => api.get('/lessons'),
    getById: (id) => api.get(`/lessons/${id}`),
    create: (data) => {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) formData.append(key, data[key])
        })
        return api.post('/lessons', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    update: (id, data) => {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) formData.append(key, data[key])
        })
        return api.put(`/lessons/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    delete: (id) => api.delete(`/lessons/${id}`),
}

// Favorites API
export const favoritesAPI = {
    getAll: () => api.get('/favorites'),
    add: (lessonId) => api.post(`/favorites/${lessonId}`),
    remove: (lessonId) => api.delete(`/favorites/${lessonId}`),
}

// Profile API
export const profileAPI = {
    get: () => api.get('/profile'),
    updateStudent: (data) => {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) formData.append(key, data[key])
        })
        return api.put('/profile/student', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    updateSchool: (data) => {
        const formData = new FormData()
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) formData.append(key, data[key])
        })
        return api.put('/profile/school', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
}

export default api
