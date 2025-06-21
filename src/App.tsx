import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { lazy } from 'react'
import LazyLoader from './components/LazyLoader'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivateRoute from './components/AdminPrivateRoute'

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Pengaduan = lazy(() => import('./pages/Pengaduan'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <LazyLoader>
              <Home />
            </LazyLoader>
          } />
          <Route path="/login" element={
            <LazyLoader>
              <Login />
            </LazyLoader>
          } />
          <Route path="/register" element={
            <LazyLoader>
              <Register />
            </LazyLoader>
          } />
          <Route path="/admin" element={
            <LazyLoader>
              <AdminLogin />
            </LazyLoader>
          } />
          <Route
            path="/dashboard"
            element={
              <LazyLoader>
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              </LazyLoader>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <LazyLoader>
                <AdminPrivateRoute>
                  <AdminDashboard />
                </AdminPrivateRoute>
              </LazyLoader>
            }
          />
          <Route
            path="/pengaduan"
            element={
              <LazyLoader>
                <PrivateRoute>
                  <Pengaduan />
                </PrivateRoute>
              </LazyLoader>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
