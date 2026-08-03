import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { extractErrorMessage } from '../api/api.js'
import AdminNav from '../components/AdminNav.jsx'
import MediaUploader from '../components/MediaUploader.jsx'

const EMPTY_FORM = {
  title: '',
  description: '',
  price: '',
  listingType: 'SALE',
  propertyType: 'House',
  city: '',
  area: '',
  address: '',
  bedrooms: '',
  bathrooms: '',
  areaSqft: '',
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
          price: p.price ?? '',
          listingType: p.listingType || 'SALE',
          propertyType: p.propertyType || 'House',
          city: p.city || '',
          area: p.area || '',
          address: p.address || '',
          bedrooms: p.bedrooms ?? '',
          bathrooms: p.bathrooms ?? '',
          areaSqft: p.areaSqft ?? '',
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
      price: form.price === '' ? null : Number(form.price),
      listingType: form.listingType,
      propertyType: form.propertyType.trim(),
      city: form.city.trim(),
      area: form.area.trim() || null,
      address: form.address.trim() || null,
      bedrooms: form.bedrooms === '' ? null : Number(form.bedrooms),
      bathrooms: form.bathrooms === '' ? null : Number(form.bathrooms),
      areaSqft: form.areaSqft === '' ? null : Number(form.areaSqft),
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
        <h1>{mode === 'edit' ? 'Edit property' : 'Add property'}</h1>

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
                Listing type
                <select value={form.listingType} onChange={(e) => set('listingType', e.target.value)}>
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                </select>
              </label>
              <label>
                Property type
                <input type="text" value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)} required />
              </label>
              <label>
                Price (AED)
                <input type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} required />
              </label>
            </div>

            <div className="admin-form__row">
              <label>
                City
                <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} required />
              </label>
              <label>
                Area / neighborhood
                <input type="text" value={form.area} onChange={(e) => set('area', e.target.value)} />
              </label>
            </div>

            <label>
              Street address
              <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} />
            </label>

            <div className="admin-form__row">
              <label>
                Bedrooms
                <input type="number" min="0" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} />
              </label>
              <label>
                Bathrooms
                <input type="number" min="0" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} />
              </label>
              <label>
                Area (sqft)
                <input type="number" min="0" value={form.areaSqft} onChange={(e) => set('areaSqft', e.target.value)} />
              </label>
            </div>

            <div className="admin-form__row">
              <label>
                Developer (for projects)
                <input
                  type="text"
                  placeholder="e.g. Emaar, Meraas, Damac"
                  value={form.developerName}
                  onChange={(e) => set('developerName', e.target.value)}
                />
              </label>
              <label>
                Project status
                <select value={form.projectStatus} onChange={(e) => set('projectStatus', e.target.value)}>
                  <option value="">— Not a project —</option>
                  <option value="OFF_PLAN">Off-plan</option>
                  <option value="READY">Ready</option>
                </select>
              </label>
            </div>

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
                {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create property'}
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
