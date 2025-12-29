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
    logoutAll: () => api.post('/auth/logout-all'),
    refresh: () => api.post('/auth/refresh', { _silent: true }), // Hint to interceptor
    getMe: () => api.get('/auth/me', { _silent: true }), // Hint to interceptor
}

// Add Response Interceptor for Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Avoid infinite loop if refresh itself fails
            if (originalRequest.url === '/auth/refresh' || originalRequest.url === '/auth/login/student' || originalRequest.url === '/auth/login/admin') {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                // Try to refresh token
                await authAPI.refresh();
                // If success, retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, session is dead
                window.dispatchEvent(new Event('auth-expired'));

                // Silent catch for initial checks
                if (originalRequest._silent) {
                    return new Promise(() => { }); // Stop error propagation for silent requests
                }
                return Promise.reject(refreshError);
            }
        }

        // Silent catch for initial checks if they fail immediately (no token)
        if (error.response?.status === 401 && originalRequest._silent) {
            return new Promise(() => { });
        }

        return Promise.reject(error);
    }
);

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
    changePassword: (data) => api.post('/profile/change-password', data),
}

export default api
