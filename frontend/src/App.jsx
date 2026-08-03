import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import PropertyDetail from './pages/PropertyDetail.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminProperties from './pages/AdminProperties.jsx'
import AdminPropertyForm from './pages/AdminPropertyForm.jsx'
import AdminLeads from './pages/AdminLeads.jsx'
import AdminPartners from './pages/AdminPartners.jsx'
import AdminSettings from './pages/AdminSettings.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        {/* Public site */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/properties/:id"
          element={
            <>
              <Navbar />
              <PropertyDetail />
              <Footer />
            </>
          }
        />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute>
              <AdminProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/properties/new"
          element={
            <ProtectedRoute>
              <AdminPropertyForm mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/properties/:id/edit"
          element={
            <ProtectedRoute>
              <AdminPropertyForm mode="edit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads"
          element={
            <ProtectedRoute>
              <AdminLeads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/partners"
          element={
            <ProtectedRoute>
              <AdminPartners />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <a href="/">Back home</a>
    </div>
  )
}
