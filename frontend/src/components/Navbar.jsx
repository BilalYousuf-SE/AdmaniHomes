import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          <img src={logo} alt="Admani Homes" className="brand__logo" />
        </Link>
        <nav className="site-nav">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
