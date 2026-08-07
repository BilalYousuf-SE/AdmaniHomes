import { useEffect, useRef, useState } from 'react'
import api, { extractErrorMessage } from '../api/api.js'
import ProjectCard from '../components/ProjectCard.jsx'
import PartnersStrip from '../components/PartnersStrip.jsx'
import AboutRealtor from '../components/AboutRealtor.jsx'
import LeadForm from '../components/LeadForm.jsx'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [partners, setPartners] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const formRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError('')
    Promise.all([
      api.get('/api/properties', { params: { page: 0, size: 24, sort: 'createdAt,desc' } }),
      api.get('/api/partners'),
      api.get('/api/settings'),
    ])
      .then(([projectsRes, partnersRes, settingsRes]) => {
        setProjects(projectsRes.data.content)
        setPartners(partnersRes.data)
        setSettings(settingsRes.data)
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  function handleEnquire(project) {
    setSelectedProject(project)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main>
      <section className="hero">
        <div className="hero__inner">
          <p className="hero__eyebrow">Admani Homes</p>
          <h1>Find your next address in Dubai.</h1>
          <p className="hero__lede">
            Curated projects, straight talk, and a direct line to the person handling your deal —
            no call centre, no account needed to browse.
          </p>
          <a href="#projects" className="btn btn--gold hero__cta">View Projects</a>
        </div>
      </section>

      <PartnersStrip partners={partners} />

      <AboutRealtor settings={settings} />

      <section className="projects-section" id="projects">
        <div className="projects-section__header">
          <p className="hero__eyebrow">Portfolio</p>
          <h2 className="section-title">Featured Projects</h2>
        </div>

        {loading && <p className="state-message">Loading projects…</p>}
        {error && <p className="state-message state-message--error">{error}</p>}
        {!loading && !error && projects.length === 0 && (
          <p className="state-message">No projects listed yet — check back soon.</p>
        )}

        <div className="projects-list">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} onEnquire={handleEnquire} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>

      <section className="contact-section" ref={formRef} id="contact-form">
        <div className="contact-section__inner">
          <p className="hero__eyebrow" style={{ textAlign: 'center' }}>Get in touch</p>
          <h2 className="section-title">
            {selectedProject ? `Enquire about ${selectedProject.title}` : "Let's talk"}
          </h2>
          <LeadForm
            propertyId={selectedProject?.id}
            propertyTitle={selectedProject?.title}
          />
          {selectedProject && (
            <button
              type="button"
              className="contact-section__clear"
              onClick={() => setSelectedProject(null)}
            >
              Not asking about a specific project? Send a general enquiry instead
            </button>
          )}
        </div>
      </section>
    </main>
  )
}
