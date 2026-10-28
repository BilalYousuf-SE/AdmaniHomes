import axios from 'axios'

// Strip any trailing slash so URLs join cleanly.
const clean = (url) => (url || '').replace(/\/+$/, '')

// Primary: Render. Backup: Back4app.
// Set these in .env locally and in Vercel for production.
// The fallbacks keep the site working if a variable is missing,
// so replace the Render placeholder below with your real URL.
const PRIMARY = clean(import.meta.env.VITE_API_URL) || 'https://admanihomes.onrender.com'
const BACKUP =
  clean(import.meta.env.VITE_API_URL_BACKUP) || 'https://admanihomes-rp9gggeg.back4.app'

export const api = axios.create({ baseURL: PRIMARY, timeout: 15000 })

// Attach the admin JWT (if present) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config
    const status = error.response?.status

    // 1) Failover: primary unreachable (no response) or gateway error -> retry once on backup.
    const primaryDown = !error.response || [502, 503, 504].includes(status)
    if (
      config &&
      primaryDown &&
      BACKUP &&
      BACKUP !== PRIMARY &&
      !config._retried &&
      config.baseURL !== BACKUP
    ) {
      config._retried = true
      config.baseURL = BACKUP
      api.defaults.baseURL = BACKUP // keep using backup for this page session
      return api(config)
    }

    // 2) Expired/invalid token on admin pages -> bounce back to login.
    if (status === 401 && window.location.pathname.startsWith('/admin')) {
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
