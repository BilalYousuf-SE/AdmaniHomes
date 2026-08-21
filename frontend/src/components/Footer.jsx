import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <img src={logo} alt="Admani Homes" className="brand__logo brand__logo--footer" />
        <p>Browsing is free, always. No account needed to view projects or send an enquiry.</p>
        <p className="site-footer__admin">
          <Link to="/contact">Contact</Link> · <Link to="/privacy">Privacy Policy</Link> · <a href="/admin/login">Admin sign in</a>
        </p>
      </div>
    </footer>
  )
}
