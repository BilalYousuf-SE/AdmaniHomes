export default function AboutRealtor({ settings }) {
  const hasBio = Boolean(settings?.bio)
  const hasPhoto = Boolean(settings?.realtorPhotoUrl)
  const hasMission = Boolean(settings?.mission)
  const hasExpertise = Boolean(settings?.expertise?.length)
  const hasRealtorName = Boolean(settings?.realtorName)
  const hasRealtorTitle = Boolean(settings?.realtorTitle)

  if (!hasBio && !hasPhoto && !hasExpertise && !hasMission && !hasRealtorName && !hasRealtorTitle) return null

  return (
    <section className="about-realtor">
      <div className={`about-realtor__inner ${hasPhoto ? '' : 'about-realtor__inner--no-photo'}`}>
        {hasPhoto && (
          <div className="about-realtor__photo">
            <img src={settings.realtorPhotoUrl} alt={settings.realtorName || 'Realtor'} />
          </div>
        )}

        <div className="about-realtor__text">
          <p className="hero__eyebrow">About</p>
          {hasRealtorName ? <h2>{settings.realtorName}</h2> : <h2>The person behind Admani Homes</h2>}
          {hasRealtorTitle && <p className="about-realtor__title">{settings.realtorTitle}</p>}

          {hasBio && (
            <div className="about-realtor__bio">
              {settings.bio.split(/\n+/).filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {hasExpertise && (
            <div className="about-realtor__expertise">
              {settings.expertise.map((item, i) => (
                <span key={i} className="about-realtor__pill">{item}</span>
              ))}
            </div>
          )}

          {hasMission && (
            <blockquote className="about-realtor__mission">
              <p>{settings.mission}</p>
            </blockquote>
          )}
        </div>
      </div>
    </section>
  )
}
