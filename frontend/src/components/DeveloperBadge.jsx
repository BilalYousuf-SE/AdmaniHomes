import { useState } from 'react'
import avatar from '../assets/dev-avatar.png'

const DEV_NAME = 'Bilal Yousuf'
const DEV_EMAIL = 'byousuf04@gmail.com'
const DEV_WHATSAPP = '+923312714551' // digits only needed for the wa.me link

export default function DeveloperBadge() {
  const [open, setOpen] = useState(false)

  return (
    <div className="dev-badge">
      {open && (
        <div className="dev-badge__card">
          <button
            type="button"
            className="dev-badge__close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
          <img src={avatar} alt={DEV_NAME} className="dev-badge__card-avatar" />
          <p className="dev-badge__name">{DEV_NAME}</p>
          <p className="dev-badge__role">Website developed by</p>
          <div className="dev-badge__links">
            <a href={`mailto:${DEV_EMAIL}`}>{DEV_EMAIL}</a>
            <a href={`https://wa.me/${DEV_WHATSAPP.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
              WhatsApp: {DEV_WHATSAPP}
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        className="dev-badge__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Contact the developer"
        aria-expanded={open}
      >
        <img src={avatar} alt="" />
      </button>
    </div>
  )
}
