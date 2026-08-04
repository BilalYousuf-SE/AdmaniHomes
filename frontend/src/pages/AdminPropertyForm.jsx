import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { extractErrorMessage } from '../api/api.js'
import AdminNav from '../components/AdminNav.jsx'
import MediaUploader from '../components/MediaUploader.jsx'

const EMPTY_FORM = {
  title: '',
  description: '',
  propertyType: '',
  city: '',
  area: '',
  address: '',
  developerName: '',
  projectStatus: '',
  imageUrls: [],
  active: true,
}

export default function AdminPropertyForm({ mode }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (mode !== 'edit') return
    api.get(`/api/properties/${id}`)
      .then((res) => {
        const p = res.data
        setForm({
          title: p.title || '',
          description: p.description || '',
          propertyType: p.propertyType || '',
          city: p.city || '',
          area: p.area || '',
          address: p.address || '',
          developerName: p.developerName || '',
          projectStatus: p.projectStatus || '',
          imageUrls: p.imageUrls || [],
          active: p.active,
        })
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [mode, id])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      propertyType: form.propertyType.trim() || null,
      city: form.city.trim() || null,
      area: form.area.trim() || null,
      address: form.address.trim() || null,
      developerName: form.developerName.trim() || null,
      projectStatus: form.projectStatus || null,
      imageUrls: form.imageUrls,
      active: form.active,
    }

    try {
      if (mode === 'edit') {
        await api.put(`/api/properties/${id}`, payload)
      } else {
        await api.post('/api/properties', payload)
      }
      navigate('/admin/properties')
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
        <h1>{mode === 'edit' ? 'Edit project' : 'Add project'}</h1>
        <p className="admin-content__subtitle">Only the title is required — leave anything else blank if you don't have it yet.</p>

        {loading ? (
          <p className="state-message">Loading…</p>
        ) : (
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} required />
            </label>

            <label>
              Description
              <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </label>

            <div className="admin-form__row">
              <label>
                Type
                <input
                  type="text"
                  placeholder="e.g. Residential Tower, Villa Community"
                  value={form.propertyType}
                  onChange={(e) => set('propertyType', e.target.value)}
                />
              </label>
              <label>
                Project status
                <select value={form.projectStatus} onChange={(e) => set('projectStatus', e.target.value)}>
                  <option value="">— Not set —</option>
                  <option value="OFF_PLAN">Off-plan</option>
                  <option value="READY">Ready</option>
                </select>
              </label>
            </div>

            <div className="admin-form__row">
              <label>
                City
                <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} />
              </label>
              <label>
                Area / neighborhood
                <input type="text" value={form.area} onChange={(e) => set('area', e.target.value)} />
              </label>
            </div>

            <label>
              Address
              <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} />
            </label>

            <label>
              Developer
              <input
                type="text"
                placeholder="e.g. Emaar, Meraas, Damac"
                value={form.developerName}
                onChange={(e) => set('developerName', e.target.value)}
              />
            </label>

            <label>
              Photos &amp; videos
              <MediaUploader
                value={form.imageUrls}
                onChange={(urls) => set('imageUrls', urls)}
              />
            </label>

            <label className="admin-form__checkbox">
              <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
              Visible on the public site
            </label>

            {error && <p className="field-error field-error--server">{error}</p>}

            <div className="admin-form__actions">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create project'}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => navigate('/admin/properties')}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
