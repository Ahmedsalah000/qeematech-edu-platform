import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Layouts
import StudentLayout from './components/layout/StudentLayout'
import AdminLayout from './components/layout/AdminLayout'

// Student Pages
import LessonsPage from './pages/student/LessonsPage'
import FavoritesPage from './pages/student/FavoritesPage'
import StudentProfilePage from './pages/student/ProfilePage'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import StudentsPage from './pages/admin/StudentsPage'
import AdminLessonsPage from './pages/admin/LessonsPage'
import SchoolProfilePage from './pages/admin/ProfilePage'

// Auth Pages
import AuthPage from './pages/AuthPage'

// Loading Component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[var(--text-secondary)]">Loading...</p>
    </div>
  </div>
)

// Protected Route for Students
const StudentRoute = ({ children }) => {
  const { isLoading, isAuthenticated, userType } = useAuth()

  if (isLoading) return <Loading />
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  if (userType !== 'student') return <Navigate to="/admin" replace />

  return children
}

// Protected Route for Admin
const AdminRoute = ({ children }) => {
  const { isLoading, isAuthenticated, userType } = useAuth()

  if (isLoading) return <Loading />
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  if (userType !== 'admin') return <Navigate to="/student" replace />

  return children
}

// Auth Route (redirect if already logged in)
const AuthRoute = ({ children }) => {
  const { isLoading, isAuthenticated, userType } = useAuth()

  if (isLoading) return <Loading />
  if (isAuthenticated) {
    return <Navigate to={userType === 'admin' ? '/admin' : '/student'} replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={
        <AuthRoute>
          <AuthPage />
        </AuthRoute>
      } />

      {/* Student Routes */}
      <Route path="/student" element={
        <StudentRoute>
          <StudentLayout />
        </StudentRoute>
      }>
        <Route index element={<Navigate to="lessons" replace />} />
        <Route path="lessons" element={<LessonsPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="lessons" element={<AdminLessonsPage />} />
        <Route path="profile" element={<SchoolProfilePage />} />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
