import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../api/api.js'
import logo from '../assets/logo.png'

export default function AdminNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const username = localStorage.getItem('admin_username')
  const [totalVisits, setTotalVisits] = useState(null)

  useEffect(() => {
    api.get('/api/visits')
      .then((res) => setTotalVisits(res.data.totalVisits))
      .catch(() => {}) // non-critical, fail silently
  }, [])

  function logout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    navigate('/admin/login')
  }

  return (
    <header className="admin-header">
      <div className="admin-header__inner">
        <Link to="/admin/properties" className="brand">
          <img src={logo} alt="Admani Homes" className="brand__logo brand__logo--admin" />
        </Link>
        <nav className="admin-nav">
          <Link className={location.pathname.startsWith('/admin/properties') ? 'is-active' : ''} to="/admin/properties">
            Projects
          </Link>
          <Link className={location.pathname.startsWith('/admin/leads') ? 'is-active' : ''} to="/admin/leads">
            Leads
          </Link>
          <Link className={location.pathname.startsWith('/admin/partners') ? 'is-active' : ''} to="/admin/partners">
            Partners
          </Link>
          <Link className={location.pathname.startsWith('/admin/settings') ? 'is-active' : ''} to="/admin/settings">
            Settings
          </Link>
        </nav>
        <div className="admin-header__user">
          {totalVisits !== null && (
            <span className="admin-header__visits" title="Total site visits">👁 {totalVisits.toLocaleString()}</span>
          )}
          <span>{username}</span>
          <button className="btn btn--ghost btn--small" onClick={logout}>Sign out</button>
        </div>
      </div>
    </header>
  )
}
