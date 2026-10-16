import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { isVideoUrl } from '../api/upload.js'
import { forgetProject, getSnapshot, reportVisibility, setSoundOn, subscribe } from '../lib/mediaFocus.js'

const STATUS_LABELS = { OFF_PLAN: 'Off-Plan', READY: 'Ready' }
const ROTATE_MS = 2800

export default function ProjectCard({ project, onEnquire, reverse }) {
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

        <button type="button" className="btn btn--primary" onClick={() => onEnquire?.(project)}>
          Enquire about this project
        </button>
      </div>
    </article>
  )
}