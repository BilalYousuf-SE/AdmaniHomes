import { whatsappLink } from '../lib/whatsapp.js'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { isVideoUrl } from '../api/upload.js'
import { forgetProject, getSnapshot, reportVisibility, setSoundOn, subscribe } from '../lib/mediaFocus.js'

const STATUS_LABELS = { OFF_PLAN: 'Off-Plan', READY: 'Ready' }
const ROTATE_MS = 2800

export default function ProjectCard({ project, onEnquire, reverse, whatsappNumber }) {
  const media = project.imageUrls || []
  const [index, setIndex] = useState(0)
  const [muted, setMuted] = useState(true)
  const mediaRef = useRef(null)
  const videoRef = useRef(null)

  const { activeId, soundOn } = useSyncExternalStore(subscribe, getSnapshot)
  const isActive = activeId === project.id

  const current = media[index]
  const isVideoSlide = Boolean(current) && isVideoUrl(current)
  // Sound is only offered when the project is nothing but video. Projects that mix
  // photos and video keep rotating and stay muted.
  const videoOnly = media.length > 0 && media.every(isVideoUrl)

  // Photo rotation. Video-only projects have no timer: each video plays through.
  useEffect(() => {
    if (media.length < 2 || videoOnly) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % media.length), ROTATE_MS)
    return () => clearInterval(timer)
  }, [media.length, videoOnly])

  // Tell the shared store how much of this project is on screen.
  useEffect(() => {
    const el = mediaRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => reportVisibility(project.id, entry.intersectionRatio),
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      forgetProject(project.id)
    }
  }, [project.id])

  // Only the project on screen plays. Everything else is paused and muted.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!isActive) {
      video.muted = true
      video.pause()
      return
    }
    video.muted = !(videoOnly && soundOn)
    video.play().catch(() => {
      // The browser refuses sound until the visitor has tapped something on the page.
      video.muted = true
      video.play().catch(() => {})
    })
  }, [isActive, soundOn, videoOnly, current])

  function toggleSound() {
    const video = videoRef.current
    if (!video) return
    if (video.muted) {
      setSoundOn(true)
      video.muted = false
      video.play().catch(() => {})
    } else {
      setSoundOn(false)
      video.muted = true
    }
  }

  const location = [project.area, project.city].filter(Boolean).join(', ')
  const infoLink = whatsappLink(whatsappNumber,
    `Hi, I'd like more information about ${project.title}${location ? ` in ${location}` : ''}. Could you please share the details?`)


  return (
    <article className={`project-row ${reverse ? 'project-row--reverse' : ''}`}>
      <div className="project-row__media" ref={mediaRef}>
        {current ? (
          isVideoSlide ? (
            <video
              key={current}
              ref={videoRef}
              src={current}
              className="project-row__media-img"
              playsInline
              preload="metadata"
              loop={!videoOnly || media.length === 1}
              onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
              onEnded={() => {
                if (videoOnly && media.length > 1) setIndex((i) => (i + 1) % media.length)
              }}
            />
          ) : (
            <img
              key={current}
              src={current}
              alt={project.title}
              loading="lazy"
              className="project-row__media-img"
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

        {videoOnly && isVideoSlide && (
          <button
            type="button"
            className="project-row__sound"
            onClick={toggleSound}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              {muted ? (
                <>
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              ) : (
                <>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              )}
            </svg>
            {muted && <span>Tap for sound</span>}
          </button>
        )}
      </div>

      <div className="project-row__content">
        {project.developerName && <p className="project-row__developer">{project.developerName}</p>}
        <h3>{project.title}</h3>
        {location && <p className="project-row__location">{location}</p>}
        {project.propertyType && <p className="project-row__type">{project.propertyType}</p>}
        {project.description && <p className="project-row__description">{project.description}</p>}

        <div className="project-row__actions">
          <button type="button" className="btn btn--primary" onClick={() => onEnquire?.(project)}>
            Enquire about this project
          </button>
          {infoLink && (
            <a href={infoLink} target="_blank" rel="noreferrer" className="project-row__whatsapp" title="More info on WhatsApp" aria-label={`For more info about ${project.title} on WhatsApp`}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M20.52 3.48A11.9 11.9 0 0 0 12.04 0C5.42 0 .04 5.38.04 12c0 2.12.55 4.18 1.6 6L0 24l6.16-1.62A11.97 11.97 0 0 0 12.04 24C18.66 24 24 18.62 24 12c0-3.2-1.24-6.21-3.48-8.52ZM12.04 22a9.96 9.96 0 0 1-5.08-1.39l-.36-.21-3.66.96.98-3.56-.24-.37A9.94 9.94 0 0 1 2.04 12c0-5.51 4.49-10 10-10a9.91 9.91 0 0 1 7.06 2.94A9.94 9.94 0 0 1 22 12c0 5.51-4.45 10-9.96 10Zm5.48-7.49c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61l.45-.52c.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.68-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
