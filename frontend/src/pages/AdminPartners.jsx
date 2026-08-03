import { useEffect, useState } from 'react'
import api, { extractErrorMessage } from '../api/api.js'
import AdminNav from '../components/AdminNav.jsx'
import MediaUploader from '../components/MediaUploader.jsx'

const EMPTY_FORM = { name: '', logoUrl: '', displayOrder: 0, active: true }

export default function AdminPartners() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  function load() {
    setLoading(true)
    setError('')
    api.get('/api/partners/admin/all')
      .then((res) => setPartners(res.data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function startEdit(partner) {
    setEditingId(partner.id)
    setForm({
      name: partner.name,
      logoUrl: partner.logoUrl,
      displayOrder: partner.displayOrder,
      active: partner.active,
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        logoUrl: form.logoUrl,
        displayOrder: Number(form.displayOrder) || 0,
        active: form.active,
      }
      if (editingId) {
        await api.put(`/api/partners/${editingId}`, payload)
      } else {
        await api.post('/api/partners', payload)
      }
      resetForm()
      load()
    } catch (err) {
      alert(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Remove "${name}" from the partners list?`)) return
    try {
      await api.delete(`/api/partners/${id}`)
      load()
    } catch (err) {
      alert(extractErrorMessage(err))
    }
  }

  return (
    <div className="admin-page">
      <AdminNav />
      <main className="admin-content">
        <div className="admin-content__header">
          <h1>Partners</h1>
        </div>

        <form className="admin-form admin-form--inline" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit partner' : 'Add a partner'}</h3>
          <div className="admin-form__row">
            <label>
              Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label>
              Display order
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              />
            </label>
          </div>

          <label>
            Logo (optional — add now, upload later if you don't have it yet)
            <MediaUploader
              value={form.logoUrl ? [form.logoUrl] : []}
              onChange={(urls) => setForm({ ...form, logoUrl: urls[urls.length - 1] || '' })}
              accept="image/*"
              maxFiles={1}
            />
          </label>

          <label className="admin-form__checkbox">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Show in the "We're working with" strip
          </label>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add partner'}
            </button>
            {editingId && (
              <button type="button" className="btn btn--ghost" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
        </form>

        {loading && <p className="state-message">Loading…</p>}
        {error && <p className="state-message state-message--error">{error}</p>}

        {!loading && !error && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.logoUrl
                        ? <img src={p.logoUrl} alt={p.name} className="admin-table__logo" />
                        : <span className="admin-table__logo admin-table__logo--placeholder">{p.name.slice(0, 2).toUpperCase()}</span>}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.displayOrder}</td>
                    <td>
                      <span className={`badge ${p.active ? 'badge--active' : 'badge--inactive'}`}>
                        {p.active ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="admin-table__actions">
                      <button className="btn btn--ghost btn--small" onClick={() => startEdit(p)}>Edit</button>
                      <button className="btn btn--danger btn--small" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {partners.length === 0 && (
                  <tr><td colSpan={5} className="state-message">No partners yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
