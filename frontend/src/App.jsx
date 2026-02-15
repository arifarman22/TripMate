import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TripsPage from './pages/TripsPage'
import TripDetailPage from './pages/TripDetailPage'
import ExpensesPage from './pages/ExpensesPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <DashboardPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/trips" element={
        <ProtectedRoute>
          <Layout>
            <TripsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/trips/:id" element={
        <ProtectedRoute>
          <Layout>
            <TripDetailPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/trips/:id/expenses" element={
        <ProtectedRoute>
          <Layout>
            <ExpensesPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <ProfilePage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App