function CompanyStat({ label, value }) {
  return (
    <div className="company-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="site-section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}

function ServiceMotion({ accent }) {
  if (accent === "solar") {
    return (
      <div className="service-motion solar">
        <div className="solar-sun" />
        <div className="solar-panel">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (accent === "elevator") {
    return (
      <div className="service-motion elevator">
        <div className="elevator-shaft" />
        <div className="elevator-cabin" />
      </div>
    );
  }

  if (accent === "road") {
    return (
      <div className="service-motion road">
        <div className="road-strip" />
        <div className="road-lane road-lane-a" />
        <div className="road-lane road-lane-b" />
      </div>
    );
  }

  return (
    <div className="service-motion travel">
      <div className="travel-route" />
      <div className="travel-point travel-point-a" />
      <div className="travel-point travel-point-b" />
      <div className="travel-point travel-point-c" />
    </div>
  );
}

function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <ServiceMotion accent={service.accent} />
      <span className="service-card-label">{service.shortLabel}</span>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </article>
  );
}

function HistoryCard({ item }) {
  return (
    <article className="history-card">
      <span>{item.year}</span>
      <h3>{item.title}</h3>
      <p>{item.copy}</p>
    </article>
  );
}

export default function CompanyWebsite({ proposal, onStartEstimate }) {
  const { supplier, companyProfile } = proposal;
  const companyStats = [
    { label: "Established", value: `Since ${supplier.establishedYear}` },
    { label: "Installed Capacity", value: supplier.installedCapacity },
    { label: "Clients", value: supplier.clientsServed },
    { label: "Support", value: supplier.supportAvailability },
  ];

  return (
    <div className="website-shell">
      <header className="website-topbar">
        <div className="website-brand">
          <div className="website-brand-mark">DS</div>
          <div>
            <p>{supplier.companyName}</p>
            <span>{supplier.serviceCoverage}</span>
          </div>
        </div>

        <nav className="website-nav">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#history">History</a>
          <button type="button" className="primary-button website-cta" onClick={onStartEstimate}>
            Generate Estimate
          </button>
        </nav>
      </header>

      <main className="website-main">
        <section className="website-hero">
          <div className="website-hero-copy">
            <p className="website-hero-eyebrow">{supplier.companyName}</p>
            <h1>{companyProfile.heroTitle}</h1>
            <p className="website-hero-copy-text">{companyProfile.heroCopy}</p>

            <div className="website-hero-actions">
              <button type="button" className="primary-button" onClick={onStartEstimate}>
                Generate Estimate
              </button>
              <a className="secondary-button website-link-button" href="#services">
                Explore Services
              </a>
            </div>

            <div className="website-stat-grid">
              {companyStats.map((item) => (
                <CompanyStat key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          <div className="website-hero-visual" aria-hidden="true">
            <div className="hero-orbit hero-orbit-sun" />
            <div className="hero-orbit hero-orbit-travel" />

            <div className="hero-visual-card hero-solar-card">
              <div className="hero-solar-sun" />
              <div className="hero-solar-panel">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="hero-visual-card hero-elevator-card">
              <div className="hero-elevator-shaft" />
              <div className="hero-elevator-cabin" />
            </div>

            <div className="hero-visual-card hero-road-card">
              <div className="hero-road-surface" />
              <div className="hero-road-mark hero-road-mark-a" />
              <div className="hero-road-mark hero-road-mark-b" />
              <div className="hero-road-mark hero-road-mark-c" />
            </div>

            <div className="hero-visual-card hero-travel-card">
              <div className="hero-route" />
              <div className="hero-route-dot hero-route-dot-a" />
              <div className="hero-route-dot hero-route-dot-b" />
              <div className="hero-route-dot hero-route-dot-c" />
            </div>
          </div>
        </section>

        <section className="website-banner">
          <div>
            <span>Owner Details</span>
            <strong>{supplier.contactPerson}</strong>
            <p>{companyProfile.ownerTitle}</p>
          </div>
          <div>
            <span>Phone</span>
            <strong>{supplier.phone}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{supplier.email}</strong>
          </div>
          <div>
            <span>Website</span>
            <strong>{supplier.website}</strong>
          </div>
        </section>

        <section className="website-section" id="about">
          <SectionHeading
            eyebrow="About Company"
            title={companyProfile.aboutTitle}
            copy="Clients can explore the company background here, while the estimate generator remains a separate workflow."
          />

          <div className="about-grid">
            <article className="about-card about-story-card">
              <h3>{companyProfile.aboutTitle}</h3>
              <p>{companyProfile.aboutCopy}</p>
              <p>{supplier.companyPromise}</p>
              <div className="about-service-line">
                {supplier.serviceLine
                  .replace("Our Services:", "")
                  .split("|")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item) => (
                    <span key={item}>{item}</span>
                  ))}
              </div>
            </article>

            <article className="about-card about-owner-card">
              <span className="about-owner-label">{companyProfile.ownerTitle}</span>
              <h3>{supplier.contactPerson}</h3>
              <p>{companyProfile.ownerSummary}</p>
              <ul className="about-owner-list">
                <li>{supplier.addressLine1}</li>
                <li>{supplier.addressLine2}</li>
                <li>{supplier.serviceCoverage}</li>
                <li>{supplier.supportAvailability}</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="website-section" id="services">
          <SectionHeading
            eyebrow="Core Services"
            title="Execution That Covers More Than One Industry"
            copy="A modern public website for the company, while the estimate generator stays available when the user is ready."
          />

          <div className="service-grid">
            {companyProfile.services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </section>

        <section className="website-section" id="history">
          <SectionHeading
            eyebrow="Company History"
            title="A Growing Service Business Since 2022"
            copy="The website highlights credibility, coverage, and operational growth before a client enters the estimate flow."
          />

          <div className="history-grid">
            {companyProfile.history.map((item) => (
              <HistoryCard key={`${item.year}-${item.title}`} item={item} />
            ))}
          </div>
        </section>

        <section className="website-cta-panel">
          <div>
            <span>Ready to Create an Estimate?</span>
            <h2>Open the existing proposal studio and generate a client-ready estimate.</h2>
            <p>
              The PDF export logic stays the same. This website simply adds a modern
              public-facing layer before users enter the estimate workflow.
            </p>
          </div>
          <button type="button" className="primary-button" onClick={onStartEstimate}>
            Generate Estimate
          </button>
        </section>
      </main>
    </div>
  );
}
