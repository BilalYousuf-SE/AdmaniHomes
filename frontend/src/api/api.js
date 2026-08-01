import axios from 'axios'

// Set VITE_API_URL in your .env / hosting provider env vars, e.g.
// VITE_API_URL=https://your-backend.onrender.com
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const api = axios.create({ baseURL })

// Attach the admin JWT (if present) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the token has expired/is invalid, the API returns 401 - bounce back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_username')
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export function extractErrorMessage(error) {
  const data = error?.response?.data
  if (data?.fieldErrors) {
    return Object.values(data.fieldErrors).join(' · ')
  }
  if (data?.error) return data.error
  return 'Something went wrong. Please try again.'
}

export default api
