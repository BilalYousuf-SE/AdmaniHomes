import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">M</span>
          <span className="brand__name">Meridian&nbsp;Homes</span>
        </Link>
        <nav className="site-nav">
          <a href="/#listings">Listings</a>
          <a href="/#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}
