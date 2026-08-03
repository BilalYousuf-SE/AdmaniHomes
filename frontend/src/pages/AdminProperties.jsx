import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api, { extractErrorMessage } from '../api/api.js'
import AdminNav from '../components/AdminNav.jsx'

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(async (pageToLoad) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/api/properties/admin/all', { params: { page: pageToLoad, size: 10 } })
      setProperties(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(page) }, [page, load])

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      await api.delete(`/api/properties/${id}`)
      setProperties((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert(extractErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="admin-page">
      <AdminNav />
      <main className="admin-content">
        <div className="admin-content__header">
          <h1>Properties</h1>
          <Link to="/admin/properties/new" className="btn btn--primary">+ Add property</Link>
        </div>

        {loading && <p className="state-message">Loading…</p>}
        {error && <p className="state-message state-message--error">{error}</p>}

        {!loading && !error && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Title</th>
                  <th>City</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td className="mono">LST-{String(p.id).padStart(4, '0')}</td>
                    <td>{p.title}</td>
                    <td>{p.city}</td>
                    <td>{p.listingType === 'RENT' ? 'Rent' : 'Sale'}</td>
                    <td>AED {Number(p.price).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${p.active ? 'badge--active' : 'badge--inactive'}`}>
                        {p.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="admin-table__actions">
                      <Link to={`/admin/properties/${p.id}/edit`} className="btn btn--ghost btn--small">Edit</Link>
                      <button
                        className="btn btn--danger btn--small"
                        onClick={() => handleDelete(p.id, p.title)}
                        disabled={deletingId === p.id}
                      >
                        {deletingId === p.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
                {properties.length === 0 && (
                  <tr><td colSpan={7} className="state-message">No properties yet. Add your first listing.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="btn btn--ghost">Previous</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="btn btn--ghost">Next</button>
          </div>
        )}
      </main>
    </div>
  )
}
