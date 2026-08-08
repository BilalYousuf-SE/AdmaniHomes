import { useEffect, useState, useCallback } from 'react'
import api, { extractErrorMessage } from '../api/api.js'
import AdminNav from '../components/AdminNav.jsx'

const STATUS_LABELS = {
  NEW: 'Yet to contact',
  IN_PROGRESS: 'In process',
  CLOSED: 'Done',
}

export default function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const load = useCallback(async (pageToLoad, status) => {
    setLoading(true)
    setError('')
    try {
      const params = { page: pageToLoad, size: 15 }
      if (status) params.status = status
      const res = await api.get('/api/leads', { params })
      setLeads(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(page, statusFilter) }, [page, statusFilter, load])

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id)
    try {
      const res = await api.patch(`/api/leads/${id}/status`, { status: newStatus })
      setLeads((prev) => prev.map((l) => (l.id === id ? res.data : l)))
    } catch (err) {
      alert(extractErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete the lead from "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/api/leads/${id}`)
      setLeads((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      alert(extractErrorMessage(err))
    }
  }

  async function handleExportCsv() {
    try {
      const res = await api.get('/api/leads/export', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = 'leads.csv'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert(extractErrorMessage(err))
    }
  }

  return (
    <div className="admin-page">
      <AdminNav />
      <main className="admin-content">
        <div className="admin-content__header">
          <h1>Leads</h1>
          <div className="admin-content__header-actions">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}>
              <option value="">All statuses</option>
              <option value="NEW">Yet to contact</option>
              <option value="IN_PROGRESS">In process</option>
              <option value="CLOSED">Done</option>
            </select>
            <button type="button" className="btn btn--ghost" onClick={handleExportCsv}>
              Download CSV
            </button>
          </div>
        </div>

        {loading && <p className="state-message">Loading…</p>}
        {error && <p className="state-message state-message--error">{error}</p>}

        {!loading && !error && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Project</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td>{l.fullName}</td>
                    <td className="mono">{l.email}</td>
                    <td className="mono">{l.phone}</td>
                    <td>{l.propertyTitle || '—'}</td>
                    <td className="admin-table__message" title={l.message}>{l.message || '—'}</td>
                    <td>
                      <select
                        value={l.status}
                        disabled={updatingId === l.id}
                        onChange={(e) => handleStatusChange(l.id, e.target.value)}
                        className={`status-select status-select--${l.status.toLowerCase()}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn--danger btn--small" onClick={() => handleDelete(l.id, l.fullName)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={7} className="state-message">No leads yet.</td></tr>
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
