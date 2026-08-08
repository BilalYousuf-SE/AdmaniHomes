import { useEffect, useState } from 'react'
import { isVideoUrl } from '../api/upload.js'

const STATUS_LABELS = { OFF_PLAN: 'Off-Plan', READY: 'Ready' }
const ROTATE_MS = 2800

export default function ProjectCard({ project, onEnquire, reverse }) {
  const media = project.imageUrls || []
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (media.length < 2) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % media.length)
    }, ROTATE_MS)
    return () => clearInterval(timer)
  }, [media.length])

  const location = [project.area, project.city].filter(Boolean).join(', ')
  const current = media[index]

  return (
    <article className={`project-row ${reverse ? 'project-row--reverse' : ''}`}>
      <div className="project-row__media">
        {current ? (
          isVideoUrl(current) ? (
            <video
              key={current}
              src={current}
              className="project-row__media-img is-active"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              key={current}
              src={current}
              alt={project.title}
              loading="lazy"
              className="project-row__media-img is-active"
            />
          )
        ) : (
          <div className="project-row__media-placeholder">No photos yet</div>
        )}

        {project.projectStatus && (
          <span className="project-row__status">{STATUS_LABELS[project.projectStatus]}</span>
        )}

        {media.length > 1 && (
          <div className="project-row__dots">
            {media.map((_, i) => (
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
