import { useState } from 'react'
import api, { extractErrorMessage } from '../api/api.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[0-9]{7,15}$/

export default function LeadForm({ propertyId, propertyTitle }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [serverError, setServerError] = useState('')

  function validate() {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Please enter your name.'
    if (!EMAIL_REGEX.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!PHONE_REGEX.test(form.phone.trim().replace(/[\s-]/g, ''))) {
      next.phone = 'Enter a valid phone number (7-15 digits, optional +country code).'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setStatus('submitting')
    try {
      await api.post('/api/leads', {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim().replace(/[\s-]/g, ''),
        message: form.message.trim() || undefined,
        propertyId: propertyId ?? null,
      })
      setStatus('success')
      setForm({ fullName: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('error')
      setServerError(extractErrorMessage(err))
    }
  }

  if (status === 'success') {
    return (
      <div className="lead-form lead-form--success">
        <h3>Message sent</h3>
        <p>Thanks — we've received your enquiry{propertyTitle ? ` about ${propertyTitle}` : ''}. Our team will reach out soon.</p>
      </div>
    )
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <h3>{propertyTitle ? `Interested in this property?` : 'Get in touch'}</h3>
      <p className="lead-form__hint">Leave your details and we'll follow up. No account needed.</p>

      <label>
        Full name
        <input
          type="text"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          aria-invalid={!!errors.fullName}
        />
        {errors.fullName && <span className="field-error">{errors.fullName}</span>}
      </label>

      <label>
        Email
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </label>

      <label>
        Phone
        <input
          type="tel"
          placeholder="+1 555 123 4567"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </label>

      <label>
        Message (optional)
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </label>

      {serverError && <p className="field-error field-error--server">{serverError}</p>}

      <button type="submit" className="btn btn--primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}
