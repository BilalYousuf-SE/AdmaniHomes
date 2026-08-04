import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function AdminNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const username = localStorage.getItem('admin_username')

  function logout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    navigate('/admin/login')
  }

  return (
    <header className="admin-header">
      <div className="admin-header__inner">
        <Link to="/admin/properties" className="brand">
          <span className="brand__mark">A</span>
          <span className="brand__name">Admani Admin</span>
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
          <span>{username}</span>
          <button className="btn btn--ghost btn--small" onClick={logout}>Sign out</button>
        </div>
      </div>
    </header>
  )
}
