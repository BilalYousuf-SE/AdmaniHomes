import { useEffect, useState } from 'react'
import { isVideoUrl } from '../api/upload.js'

const STATUS_LABELS = { OFF_PLAN: 'Off-Plan', READY: 'Ready' }
const ROTATE_MS = 2800

export default function ProjectCard({ project, onEnquire, reverse }) {
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
    <article className={`project-row ${reverse ? 'project-row--reverse' : ''}`}>
      <div className="project-row__media">
        {images.length > 0 ? (
          images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={project.title}
              loading="lazy"
              className={`project-row__media-img ${i === index ? 'is-active' : ''}`}
            />
          ))
        ) : (
          <div className="project-row__media-placeholder">No photos yet</div>
        )}

        {project.projectStatus && (
          <span className="project-row__status">{STATUS_LABELS[project.projectStatus]}</span>
        )}

        {images.length > 1 && (
          <div className="project-row__dots">
            {images.map((_, i) => (
              <span key={i} className={i === index ? 'is-active' : ''} />
            ))}
          </div>
        )}
      </div>

      <div className="project-row__content">
        {project.developerName && <p className="project-row__developer">{project.developerName}</p>}
        <h3>{project.title}</h3>
        {location && <p className="project-row__location">{location}</p>}
        {project.propertyType && <p className="project-row__type">{project.propertyType}</p>}
        {project.description && <p className="project-row__description">{project.description}</p>}

        <button type="button" className="btn btn--primary" onClick={() => onEnquire?.(project)}>
          Enquire about this project
        </button>
      </div>
    </article>
  )
}
