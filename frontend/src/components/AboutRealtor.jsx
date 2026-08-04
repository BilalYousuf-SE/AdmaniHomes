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
      <div className="about-realtor__text">
        <p className="hero__eyebrow">About</p>

        <h2>The person behind Admani Homes</h2>

        {hasRealtorName && (
          <h3>{settings.realtorName}</h3>
        )}

        {hasRealtorTitle && (
          <p className="about-realtor__title">
            {settings.realtorTitle}
          </p>
        )}

        {hasBio && (
          <p>{settings.bio}</p>
        )}

        {hasMission && (
          <>
            <h3>Mission</h3>
            <p>{settings.mission}</p>
          </>
        )}

        {hasExpertise && (
          <>
            <h3>Areas of Expertise</h3>
            <ul>
              {settings.expertise.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
} 
