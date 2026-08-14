import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import api, { extractErrorMessage } from '../api/api.js'
import logo from '../assets/logo.png'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (localStorage.getItem('admin_token')) {
    return <Navigate to="/admin/properties" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await api.post('/api/auth/login', form)
      localStorage.setItem('admin_token', res.data.token)
      localStorage.setItem('admin_username', res.data.username)
      navigate('/admin/properties')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-auth">
      <div className="admin-auth__wrap">
        <img src={logo} alt="Admani Homes" className="admin-auth__logo" />
        <form className="admin-auth__card" onSubmit={handleSubmit}>
          <h1>Admin sign in</h1>
          <p className="admin-auth__hint">Manage projects and leads.</p>

          <label>
            Username
            <input
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>

          {error && <p className="field-error field-error--server">{error}</p>}

          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <a href="/" className="admin-auth__back">Back to site</a>
        </form>
      </div>
    </main>
  )
}
