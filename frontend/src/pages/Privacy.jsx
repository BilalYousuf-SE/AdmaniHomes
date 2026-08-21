import { useEffect, useState } from 'react'
import api from '../api/api.js'

export default function Privacy() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    api.get('/api/settings').then((res) => setSettings(res.data)).catch(() => {})
  }, [])

  const contactEmail = settings?.email || 'the contact details on our Contact page'

  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <p className="hero__eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-page__updated">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <p>
          Admani Homes ("we," "us," "our") respects your privacy. This page explains what
          information we collect through this website, why we collect it, and how it's handled.
        </p>

        <h2>Information we collect</h2>
        <p>We only collect information you choose to give us. Specifically:</p>
        <ul>
          <li><strong>Enquiry details</strong> — when you submit the contact form, we collect your name, email address, phone number, and any message you write, along with which project (if any) you were asking about.</li>
          <li><strong>Site visit counts</strong> — we log a simple count of page visits to understand overall traffic. This is an aggregate number only — we do not track individual visitors, build browsing profiles, or use analytics cookies.</li>
        </ul>
        <p>We do not require an account or login to browse this site, and we never ask for payment or financial information through it.</p>

        <h2>How we use your information</h2>
        <ul>
          <li>To respond to your enquiry about a property or project</li>
          <li>To follow up with you regarding real estate opportunities you've expressed interest in</li>
          <li>To keep basic internal records of enquiries so we can track and improve our response process</li>
        </ul>
        <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>

        <h2>Who can see your information</h2>
        <p>
          Enquiry details are only accessible to authorized administrators of Admani Homes through
          a password-protected admin dashboard. They are never displayed publicly on this website.
        </p>

        <h2>Third-party services we use</h2>
        <p>To run this website, we rely on a small number of trusted service providers, each of which processes limited data on our behalf:</p>
        <ul>
          <li><strong>Cloudinary</strong> — hosts the photos and videos shown on our project listings.</li>
          <li><strong>WhatsApp</strong> — if you choose to contact us via WhatsApp (including by scanning our QR code), that conversation is subject to WhatsApp's own privacy policy, not ours.</li>
          <li><strong>Our hosting providers</strong> (Render, Vercel, and our database provider) — store and serve the website and its data securely.</li>
        </ul>

        <h2>Data retention</h2>
        <p>
          We keep enquiry records for as long as they're useful for following up with you, or until
          you ask us to delete them. You can request deletion at any time — see "Your rights" below.
        </p>

        <h2>Cookies and local storage</h2>
        <p>
          This site does not use tracking or advertising cookies. The only browser storage used is a
          login token for administrators, which is not applicable to regular visitors browsing the site.
        </p>

        <h2>Your rights</h2>
        <p>You can ask us at any time to:</p>
        <ul>
          <li>Tell you what information we hold about you</li>
          <li>Correct inaccurate information</li>
          <li>Delete your information from our records</li>
        </ul>
        <p>To make a request, contact us at {contactEmail}.</p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this page from time to time as the website changes. The "last updated" date
          above will always reflect the most recent version.
        </p>

        <h2>Contact us</h2>
        <p>
          Questions about this policy or how your information is handled? Reach out via our{' '}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </main>
  )
}
