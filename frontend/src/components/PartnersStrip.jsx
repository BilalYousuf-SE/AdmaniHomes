export default function PartnersStrip({ partners }) {
  if (!partners || partners.length === 0) return null

  // Duplicate the list so the CSS marquee can loop seamlessly.
  const loop = [...partners, ...partners]

  return (
    <section className="partners-strip">
      <p className="partners-strip__eyebrow">Our Network of Premium Developers</p>
      <div className="partners-strip__track">
        {loop.map((p, i) => (
          <div className="partners-strip__item" key={`${p.id}-${i}`}>
            {p.logoUrl ? (
              <img src={p.logoUrl} alt={p.name} />
            ) : (
              <span className="partners-strip__badge">{p.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
