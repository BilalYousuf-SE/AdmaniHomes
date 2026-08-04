import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <span className="brand__mark">A</span>
          <span className="brand__name">Admani Homes</span>
        </div>
        <p>Browsing is free, always. No account needed to view projects or send an enquiry.</p>
        <p className="site-footer__admin">
          <Link to="/contact">Contact</Link> · <a href="/admin/login">Admin sign in</a>
        </p>
      </div>
    </footer>
  )
}
