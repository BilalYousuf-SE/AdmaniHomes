import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">M</span>
          <span className="brand__name">Admani&nbsp;Homes</span>
        </Link>
        <nav className="site-nav">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
