import { useEffect, useState } from 'react'
import api from '../api/api.js'

// Change this whenever you edit the terms.
const LAST_UPDATED = 'September 2026'

export default function Terms() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    api.get('/api/settings').then((res) => setSettings(res.data)).catch(() => {})
  }, [])

  const contactEmail = settings?.email || 'the details on our Contact page'

  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <p className="hero__eyebrow">Legal</p>
        <h1>Terms of Use</h1>
        <p className="legal-page__updated">Last updated: {LAST_UPDATED}</p>

        <p>
          Welcome to Admani Homes. By using this website you agree to these terms. If you do not
          agree with them, please do not use the site.
        </p>

        <h2>About this website</h2>
        <p>
          This website showcases real estate projects and lets you send us an enquiry. Admani Homes
          provides real estate consultancy and advisory services. Browsing the site is free and does
          not require an account.
        </p>

        <h2>Project information</h2>
        <ul>
          <li>Project descriptions, photos, videos and renders are provided for general information and illustration. Images may be artist impressions and may differ from the finished development.</li>
          <li>Details such as availability, pricing, payment plans, unit types and handover dates are set by the developer and can change without notice. Always confirm them in writing with the developer or with us before making any decision.</li>
          <li>Nothing on this website is an offer, a reservation, or a binding contract.</li>
        </ul>

        <h2>Enquiries</h2>
        <p>
          When you send an enquiry through the contact form, you confirm that the details you give
          are accurate and that we may contact you about your request. Sending an enquiry does not
          create a client relationship or any obligation on either side. How we handle your details
          is explained in our <a href="/privacy">Privacy Policy</a>.
        </p>

        <h2>Not financial or legal advice</h2>
        <p>
          Property investment carries risk, and values and rental returns can go down as well as up.
          Anything you read here or hear from us is general guidance only. It is not financial,
          legal, tax or investment advice. Please do your own research and take professional advice
          before you commit to a purchase.
        </p>

        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Submit false, misleading or spam enquiries, or use automated tools to send them in bulk</li>
          <li>Try to access areas of the site that are not meant for the public, including the admin area</li>
          <li>Interfere with the site's operation, security or other visitors' use of it</li>
          <li>Copy or scrape the site's content on a large scale without our permission</li>
        </ul>

        <h2>Intellectual property</h2>
        <p>
          The Admani Homes name, logo, design and original content on this site belong to us.
          Developer names, logos, project images and videos belong to their respective owners and are
          shown only to identify and describe projects. Their appearance on this site does not mean
          that the developer endorses this website.
        </p>

        <h2>Third-party links and services</h2>
        <p>
          This site links to services we do not control, such as WhatsApp and developer websites. We
          are not responsible for their content or practices, and your use of them is covered by
          their own terms.
        </p>

        <h2>Disclaimer</h2>
        <p>
          We work to keep the information on this site accurate and up to date, but we do not
          guarantee that it is complete, current or free of errors. The site is provided "as is",
          and we cannot promise it will always be available or uninterrupted.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Admani Homes is not liable for any loss or damage
          arising from your use of this website or from relying on the information on it. Nothing in
          these terms limits any liability that cannot be limited by law.
        </p>

        <h2>Changes</h2>
        <p>
          We may update the website and these terms from time to time. The date at the top of this
          page shows when they were last changed. Continuing to use the site after a change means you
          accept the updated terms.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the United Arab Emirates as applied in the Emirate
          of Dubai, and any dispute will be handled by the competent courts there.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Contact us at {contactEmail}, or through our{' '}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </main>
  )
}