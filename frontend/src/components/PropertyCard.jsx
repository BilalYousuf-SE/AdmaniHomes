import { Link } from 'react-router-dom'

function formatPrice(price, listingType) {
  const n = Number(price)
  const formatted = n.toLocaleString(undefined, { maximumFractionDigits: 0 })
  return listingType === 'RENT' ? `$${formatted} / mo` : `$${formatted}`
}

function refCode(id) {
  return `LST-${String(id).padStart(4, '0')}`
}

export default function PropertyCard({ property }) {
  const image = property.imageUrls?.[0]

  return (
    <Link to={`/properties/${property.id}`} className="listing-card">
      <div className="listing-card__media">
        {image ? (
          <img src={image} alt={property.title} loading="lazy" />
        ) : (
          <div className="listing-card__media listing-card__media--placeholder">No photo</div>
        )}
        <span className="listing-card__tag">{property.listingType === 'RENT' ? 'For Rent' : 'For Sale'}</span>
      </div>

      <div className="listing-card__body">
        <div className="listing-card__ref">{refCode(property.id)}</div>
        <h3 className="listing-card__title">{property.title}</h3>
        <p className="listing-card__location">{[property.area, property.city].filter(Boolean).join(', ')}</p>

        <div className="listing-card__facts">
          {property.bedrooms != null && <span>{property.bedrooms} bd</span>}
          {property.bathrooms != null && <span>{property.bathrooms} ba</span>}
          {property.areaSqft != null && <span>{property.areaSqft.toLocaleString()} sqft</span>}
        </div>

        <div className="listing-card__perforation" aria-hidden="true" />

        <div className="listing-card__price">{formatPrice(property.price, property.listingType)}</div>
      </div>
    </Link>
  )
}
