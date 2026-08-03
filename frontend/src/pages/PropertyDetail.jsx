import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api, { extractErrorMessage } from '../api/api.js'
import LeadForm from '../components/LeadForm.jsx'

function formatPrice(price, listingType) {
  const n = Number(price)
  const formatted = n.toLocaleString(undefined, { maximumFractionDigits: 0 })
  return listingType === 'RENT' ? `AED ${formatted} / yr` : `AED ${formatted}`
}

export default function PropertyDetail() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.get(`/api/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <main className="page-pad"><p className="state-message">Loading…</p></main>
  if (error || !property) {
    return (
      <main className="page-pad">
        <p className="state-message state-message--error">{error || 'Property not found.'}</p>
        <Link to="/" className="btn btn--ghost">Back to listings</Link>
      </main>
    )
  }

  const images = property.imageUrls?.length ? property.imageUrls : []

  return (
    <main className="property-detail">
      <div className="property-detail__gallery">
        {images.length > 0 ? (
          <>
            <img className="property-detail__hero-image" src={images[activeImage]} alt={property.title} />
            {images.length > 1 && (
              <div className="property-detail__thumbs">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    className={`property-detail__thumb ${i === activeImage ? 'is-active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="property-detail__hero-image property-detail__hero-image--placeholder">No photos yet</div>
        )}
      </div>

      <div className="property-detail__content">
        <div className="property-detail__main">
          <p className="property-detail__ref">LST-{String(property.id).padStart(4, '0')} · {property.listingType === 'RENT' ? 'For Rent' : 'For Sale'}</p>
          <h1>{property.title}</h1>
          <p className="property-detail__location">{[property.address, property.area, property.city].filter(Boolean).join(', ')}</p>

          <div className="property-detail__facts">
            {property.bedrooms != null && <div><strong>{property.bedrooms}</strong><span>Bedrooms</span></div>}
            {property.bathrooms != null && <div><strong>{property.bathrooms}</strong><span>Bathrooms</span></div>}
            {property.areaSqft != null && <div><strong>{property.areaSqft.toLocaleString()}</strong><span>Sqft</span></div>}
            <div><strong>{property.propertyType}</strong><span>Type</span></div>
          </div>

          <p className="property-detail__price">{formatPrice(property.price, property.listingType)}</p>

          {property.description && (
            <div className="property-detail__description">
              <h2>About this property</h2>
              <p>{property.description}</p>
            </div>
          )}
        </div>

        <div className="property-detail__sidebar">
          <LeadForm propertyId={property.id} propertyTitle={property.title} />
        </div>
      </div>
    </main>
  )
}
