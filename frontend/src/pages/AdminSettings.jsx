import { useEffect, useState } from 'react'
import api, { extractErrorMessage } from '../api/api.js'
import AdminNav from '../components/AdminNav.jsx'
import MediaUploader from '../components/MediaUploader.jsx'

export default function AdminSettings() {
  const [form, setForm] = useState({
    realtorName: '',
    realtorTitle: '',
    bio: '',
    mission: '',
    expertise: [],
    realtorPhotoUrl: '',
    whatsappNumber: '',
  })
  const [expertiseInput, setExpertiseInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/api/settings')
      .then((res) => {
        setForm({
          realtorName: res.data.realtorName || '',
          realtorTitle: res.data.realtorTitle || '',
          bio: res.data.bio || '',
          mission: res.data.mission || '',
          expertise: res.data.expertise || [],
          realtorPhotoUrl: res.data.realtorPhotoUrl || '',
          whatsappNumber: res.data.whatsappNumber || '',
        })
        setExpertiseInput((res.data.expertise || []).join(', '))
      })
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
              Realtor name
              <input
                type="text"
                value={form.realtorName}
                onChange={(e) => setForm({ ...form, realtorName: e.target.value })}
              />
            </label>

            <label>
              Title / role
              <input
                type="text"
                placeholder="e.g. Real Estate Consultant | Investment Advisor"
                value={form.realtorTitle}
                onChange={(e) => setForm({ ...form, realtorTitle: e.target.value })}
              />
            </label>

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
                rows={6}
                placeholder="A couple of paragraphs about who you are and your approach…"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </label>

            <label>
              Mission
              <textarea
                rows={4}
                value={form.mission}
                onChange={(e) => setForm({ ...form, mission: e.target.value })}
              />
            </label>

            <label>
              Areas of expertise (comma separated)
              <textarea
                rows={3}
                placeholder="Off-Plan Properties, Investment Advisory, Market Analysis"
                value={expertiseInput}
                onChange={(e) => {
                  setExpertiseInput(e.target.value)
                  setForm({
                    ...form,
                    expertise: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }}
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
