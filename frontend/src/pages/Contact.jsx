import { useEffect, useState } from 'react'
import api, { extractErrorMessage } from '../api/api.js'
import LeadForm from '../components/LeadForm.jsx'

function whatsappLink(number) {
  const digits = (number || '').replace(/[^0-9]/g, '')
  return `https://wa.me/${digits}`
}

export default function Contact() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/settings')
      .then((res) => setSettings(res.data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const hasWhatsapp = Boolean(settings?.whatsappNumber)
  const link = hasWhatsapp ? whatsappLink(settings.whatsappNumber) : null
  const qrSrc = hasWhatsapp
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(link)}`
    : null

  const socials = [
    settings?.email && { label: settings.email, href: `mailto:${settings.email}` },
    settings?.instagramUrl && { label: 'Instagram', href: settings.instagramUrl },
    settings?.facebookUrl && { label: 'Facebook', href: settings.facebookUrl },
    settings?.linkedinUrl && { label: 'LinkedIn', href: settings.linkedinUrl },
  ].filter(Boolean)

  return (
    <main className="contact-page">
      <section className="hero hero--compact">
        <div className="hero__inner">
          <p className="hero__eyebrow">Get in touch</p>
          <h1>Let's talk about your next move.</h1>
          <p className="hero__lede">Send a message below, or reach us directly on WhatsApp.</p>
        </div>
      </section>

      <section className="contact-page__body">
        {loading && <p className="state-message">Loading…</p>}
        {error && <p className="state-message state-message--error">{error}</p>}

        {!loading && !error && (
          <div className="contact-page__grid">
            {hasWhatsapp && (
              <div className="contact-page__whatsapp">
                <h2>Scan to chat</h2>
                <img src={qrSrc} alt="WhatsApp QR code" className="contact-page__qr" />
                <a href={link} target="_blank" rel="noreferrer" className="btn btn--primary">
                  Open WhatsApp chat
                </a>

                {socials.length > 0 && (
                  <div className="contact-page__socials">
                    {socials.map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="contact-page__form">
              <LeadForm />
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
