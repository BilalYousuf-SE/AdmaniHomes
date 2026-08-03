import { useEffect, useState } from 'react'
import api, { extractErrorMessage } from '../api/api.js'
import AdminNav from '../components/AdminNav.jsx'
import MediaUploader from '../components/MediaUploader.jsx'

export default function AdminSettings() {
  const [form, setForm] = useState({ bio: '', realtorPhotoUrl: '', whatsappNumber: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/api/settings')
      .then((res) => setForm({
        bio: res.data.bio || '',
        realtorPhotoUrl: res.data.realtorPhotoUrl || '',
        whatsappNumber: res.data.whatsappNumber || '',
      }))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaved(false)
    setSaving(true)
    try {
      await api.put('/api/settings', form)
      setSaved(true)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page">
      <AdminNav />
      <main className="admin-content admin-content--narrow">
        <h1>Site settings</h1>
        <p className="admin-content__subtitle">
          This powers the "About" section and contact links on the public site.
        </p>

        {loading ? (
          <p className="state-message">Loading…</p>
        ) : (
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Your photo
              <MediaUploader
                value={form.realtorPhotoUrl ? [form.realtorPhotoUrl] : []}
                onChange={(urls) => setForm({ ...form, realtorPhotoUrl: urls[urls.length - 1] || '' })}
                accept="image/*"
                maxFiles={1}
              />
            </label>

            <label>
              Bio
              <textarea
                rows={5}
                placeholder="A couple of sentences about who you are and your approach…"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </label>

            <label>
              WhatsApp number
              <input
                type="tel"
                placeholder="+971 50 000 0000"
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              />
            </label>

            {error && <p className="field-error field-error--server">{error}</p>}
            {saved && <p className="admin-settings__saved">Saved.</p>}

            <div className="admin-form__actions">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
