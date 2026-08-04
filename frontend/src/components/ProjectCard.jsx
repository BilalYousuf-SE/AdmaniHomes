import { useEffect, useState } from 'react'
import { isVideoUrl } from '../api/upload.js'

const STATUS_LABELS = { OFF_PLAN: 'Off-Plan', READY: 'Ready' }
const ROTATE_MS = 3500

export default function ProjectCard({ project, onEnquire }) {
  const images = (project.imageUrls || []).filter((u) => !isVideoUrl(u))
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, ROTATE_MS)
    return () => clearInterval(timer)
  }, [images.length])

  const location = [project.area, project.city].filter(Boolean).join(', ')

  return (
    <div className="listing-card">
      <div className="listing-card__media">
        {images.length > 0 ? (
          images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={project.title}
              loading="lazy"
              className={`listing-card__media-img ${i === index ? 'is-active' : ''}`}
            />
          ))
        ) : (
          <div className="listing-card__media listing-card__media--placeholder">No photo yet</div>
        )}

        {project.projectStatus && (
          <span className="listing-card__tag">{STATUS_LABELS[project.projectStatus]}</span>
        )}

        {images.length > 1 && (
          <div className="listing-card__dots">
            {images.map((_, i) => (
              <span key={i} className={i === index ? 'is-active' : ''} />
            ))}
          </div>
        )}
      </div>

      <div className="listing-card__body">
        {project.developerName && (
          <div className="listing-card__ref">{project.developerName}</div>
        )}

        <h3 className="listing-card__title">{project.title}</h3>

        {location && <p className="listing-card__location">{location}</p>}

        {project.description && (
          <p className="listing-card__description">{project.description}</p>
        )}

        {project.propertyType && (
          <div className="listing-card__facts">
            <span>{project.propertyType}</span>
          </div>
        )}

        <button type="button" className="btn btn--primary listing-card__cta" onClick={() => onEnquire?.(project)}>
          Enquire about this project
        </button>
      </div>
    </div>
  )
}
