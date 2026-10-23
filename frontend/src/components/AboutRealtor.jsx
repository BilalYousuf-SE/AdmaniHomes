import { useId, useState } from 'react'

function ProfileCard({ name, title, photo, bio }) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const bioId = useId()
  const visible = expanded || hovered || focused

  return (
    <article className={`profile-card ${visible ? 'profile-card--open' : ''}`}
      onMouseEnter={() => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setHovered(true)
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) setFocused(true)
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
      }}>
      {photo && <div className="profile-card__photo"><img src={photo} alt={name || 'Admani Homes team member'} loading="lazy" /></div>}
      <div className="profile-card__intro">
        <h3>{name || 'Meet your property advisor'}</h3>
        {title && <p className="profile-card__title">{title}</p>}
        {bio && (
          <button type="button" className="profile-card__toggle" aria-expanded={visible} aria-controls={bioId}
            onClick={() => { setExpanded(!visible); setHovered(false); setFocused(false) }}>
            {visible ? 'Close bio' : 'Read bio'} <span aria-hidden="true">{visible ? '−' : '+'}</span>
          </button>
        )}
      </div>
      {bio && (
        <div id={bioId} className="profile-card__bio" hidden={!visible}>
          {bio.split(/\n+/).filter(Boolean).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </div>
      )}
    </article>
  )
}

export default function AboutRealtor({ settings }) {
  const profiles = [
    { name: settings?.realtorName, title: settings?.realtorTitle, photo: settings?.realtorPhotoUrl, bio: settings?.bio },
    { name: settings?.secondRealtorName, title: settings?.secondRealtorTitle, photo: settings?.additionalPhotoUrl, bio: settings?.secondBio },
  ].filter((profile) => Object.values(profile).some(Boolean))
  if (!profiles.length) return null

  return (
    <section className="about-realtor" aria-labelledby="about-heading">
      <div className="about-realtor__heading">
        <p className="hero__eyebrow">About us</p>
        <h2 id="about-heading">The people behind your next move.</h2>
      </div>
      <div className={`profile-grid ${profiles.length === 1 ? 'profile-grid--single' : ''}`}>
        {profiles.map((profile, index) => <ProfileCard key={index} {...profile} />)}
      </div>
    </section>
  )
}
