export default function AboutRealtor({ settings }) {
  const hasBio = Boolean(settings?.bio)
  const hasPhoto = Boolean(settings?.realtorPhotoUrl)

  if (!hasBio && !hasPhoto) return null

  return (
    <section className="about-realtor">
      <div className={`about-realtor__inner ${hasPhoto ? '' : 'about-realtor__inner--no-photo'}`}>
        {hasPhoto && (
          <div className="about-realtor__photo">
            <img src={settings.realtorPhotoUrl} alt="" />
          </div>
        )}
        <div className="about-realtor__text">
          <p className="hero__eyebrow">About</p>
          <h2>The person behind Admani Homes</h2>
          {hasBio && <p>{settings.bio}</p>}
        </div>
      </div>
    </section>
  )
}
