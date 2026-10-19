import { useEffect, useState } from 'react'
import api, { extractErrorMessage } from '../api/api.js'
import LeadForm from '../components/LeadForm.jsx'
import { whatsappLink } from '../lib/whatsapp.js'

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

  const link = whatsappLink(settings?.whatsappNumber)
  const secondaryLink = whatsappLink(settings?.secondaryWhatsappNumber)
  const qrSrc = link
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(link)}`
    : null
  const secondaryQrSrc = settings?.secondaryWhatsappQrUrl || (secondaryLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(secondaryLink)}`
    : null)

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
            {(link || secondaryQrSrc || socials.length > 0) && (
              <div className="contact-page__whatsapp">
                {link && (
                  <>
                    <h2>Scan to chat</h2>
                    <img src={qrSrc} alt="WhatsApp QR code" className="contact-page__qr" />
                    <a href={link} target="_blank" rel="noreferrer" className="btn btn--primary">
                      Open WhatsApp chat
                    </a>
                  </>
                )}

                {secondaryQrSrc && (
                  <div className="contact-page__additional-whatsapp">
                    <h2>Another way to chat</h2>
                    <img src={secondaryQrSrc} alt="Additional WhatsApp QR code" className="contact-page__qr" />
                    {secondaryLink && (
                      <a href={secondaryLink} target="_blank" rel="noreferrer" className="btn btn--primary">
                        Open second WhatsApp chat
                      </a>
                    )}
                  </div>
                )}

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
