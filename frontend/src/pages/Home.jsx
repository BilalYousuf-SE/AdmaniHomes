import { useEffect, useState, useCallback } from 'react'
import api, { extractErrorMessage } from '../api/api.js'
import PropertyCard from '../components/PropertyCard.jsx'
import LeadForm from '../components/LeadForm.jsx'

const PROPERTY_TYPES = ['House', 'Apartment', 'Plot', 'Commercial', 'Villa']

export default function Home() {
  const [properties, setProperties] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    keyword: '',
    city: '',
    listingType: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)

  const fetchProperties = useCallback(async (pageToLoad, activeFilters) => {
    setLoading(true)
    setError('')
    try {
      const params = { page: pageToLoad, size: 9 }
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) params[key] = value
      })
      const res = await api.get('/api/properties', { params })
      setProperties(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties(page, appliedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, appliedFilters])

  function handleFilterSubmit(e) {
    e.preventDefault()
    setPage(0)
    setAppliedFilters(filters)
  }

  function handleReset() {
    const cleared = { keyword: '', city: '', listingType: '', propertyType: '', minPrice: '', maxPrice: '' }
    setFilters(cleared)
    setAppliedFilters(cleared)
    setPage(0)
  }

  return (
    <main>
      <section className="hero">
        <div className="hero__inner">
          <p className="hero__eyebrow">Meridian Homes</p>
          <h1>Every listing, out in the open.</h1>
          <p className="hero__lede">
            Browse verified properties for sale and rent — no account, no gatekeeping.
            Found one you like? Send an enquiry in seconds.
          </p>
        </div>
      </section>

      <section className="filters" id="listings">
        <form className="filters__form" onSubmit={handleFilterSubmit}>
          <input
            type="text"
            placeholder="Search by keyword…"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
          <select
            value={filters.listingType}
            onChange={(e) => setFilters({ ...filters, listingType: e.target.value })}
          >
            <option value="">Sale or Rent</option>
            <option value="SALE">For Sale</option>
            <option value="RENT">For Rent</option>
          </select>
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
          >
            <option value="">Property type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            min="0"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
          <div className="filters__actions">
            <button type="submit" className="btn btn--primary">Search</button>
            <button type="button" className="btn btn--ghost" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </section>

      <section className="listing-grid-section">
        {loading && <p className="state-message">Loading listings…</p>}
        {error && <p className="state-message state-message--error">{error}</p>}
        {!loading && !error && properties.length === 0 && (
          <p className="state-message">No properties match your search yet. Try widening your filters.</p>
        )}

        <div className="listing-grid">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="btn btn--ghost">
              Previous
            </button>
            <span>Page {page + 1} of {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="btn btn--ghost">
              Next
            </button>
          </div>
        )}
      </section>

      <section className="contact-section">
        <div className="contact-section__inner">
          <LeadForm />
        </div>
      </section>
    </main>
  )
}
