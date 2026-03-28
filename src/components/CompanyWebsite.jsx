import { useEffect, useRef, useState } from "react";

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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.5 4.75a5.75 5.75 0 1 0 0 11.5 5.75 5.75 0 0 0 0-11.5Zm0-1.5a7.25 7.25 0 1 1 0 14.5 7.25 7.25 0 0 1 0-14.5Zm10.03 15.72-4.02-4.02 1.06-1.06 4.02 4.02a.75.75 0 1 1-1.06 1.06Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WebsiteBackground() {
  return (
    <div className="website-background" aria-hidden="true">
      <div className="website-background-glow website-background-glow-solar" />
      <div className="website-background-glow website-background-glow-elevator" />
      <div className="website-background-grid" />

      <div className="website-background-solar">
        <div className="website-background-sun" />
        <div className="website-background-panel-bank">
          <div className="website-background-panel">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="website-background-panel secondary">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="website-background-elevator">
        <div className="website-background-elevator-shaft" />
        <div className="website-background-elevator-cabin" />
      </div>
    </div>
  );
}

function getCompanyInitials(name) {
  return (name || "DS")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function matchesSearch(values, query) {
  if (!query) {
    return false;
  }

  return values.some((value) => String(value).toLowerCase().includes(query));
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

function ServiceCard({ id, isHighlighted, service }) {
  return (
    <article
      id={id}
      className={`service-card website-search-target ${isHighlighted ? "is-highlighted" : ""}`.trim()}
    >
      <ServiceMotion accent={service.accent} />
      <span className="service-card-label">{service.shortLabel}</span>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </article>
  );
}

function HistoryCard({ id, isHighlighted, item }) {
  return (
    <article
      id={id}
      className={`history-card website-search-target ${isHighlighted ? "is-highlighted" : ""}`.trim()}
    >
      <span>{item.year}</span>
      <h3>{item.title}</h3>
      <p>{item.copy}</p>
    </article>
  );
}

export default function CompanyWebsite({ proposal, onStartEstimate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const { supplier, companyProfile } = proposal;
  const companyStats = [
    { label: "Established", value: `Since ${supplier.establishedYear}` },
    { label: "Installed Capacity", value: supplier.installedCapacity },
    { label: "Clients", value: supplier.clientsServed },
    { label: "Support", value: supplier.supportAvailability },
  ];
  const heroServiceLabels = Object.fromEntries(
    companyProfile.services.map((service) => [service.accent, service.shortLabel]),
  );
  const companyInitials = getCompanyInitials(supplier.companyName);
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const searchTargets = [
    {
      id: "about",
      title: "About Company",
      subtitle: companyProfile.aboutTitle,
      copy: companyProfile.aboutCopy,
      type: "Section",
    },
    {
      id: "about-owner",
      title: supplier.contactPerson,
      subtitle: companyProfile.ownerTitle,
      copy: companyProfile.ownerSummary,
      type: "Leadership",
    },
    ...companyProfile.services.map((service) => ({
      id: `service-${service.accent}`,
      title: service.title,
      subtitle: service.shortLabel,
      copy: service.description,
      type: "Service",
    })),
    ...companyProfile.history.map((item, index) => ({
      id: `history-${index}`,
      title: item.title,
      subtitle: item.year,
      copy: item.copy,
      type: "History",
    })),
    {
      id: "estimate-studio",
      title: "Generate Estimate",
      subtitle: "Proposal Studio",
      copy: "Open the estimate workflow for a client-ready proposal.",
      type: "Action",
      action: onStartEstimate,
    },
  ];
  const searchResults = normalizedSearch
    ? searchTargets
        .filter((target) =>
          matchesSearch([target.title, target.subtitle, target.copy], normalizedSearch),
        )
        .slice(0, 7)
    : searchTargets.slice(0, 5);
  const aboutMatches = matchesSearch(
    [companyProfile.aboutTitle, companyProfile.aboutCopy, supplier.companyPromise],
    normalizedSearch,
  );
  const ownerMatches = matchesSearch(
    [
      supplier.contactPerson,
      companyProfile.ownerTitle,
      companyProfile.ownerSummary,
      supplier.addressLine1,
      supplier.addressLine2,
      supplier.serviceCoverage,
      supplier.supportAvailability,
    ],
    normalizedSearch,
  );
  const servicesSectionMatches = matchesSearch(
    companyProfile.services.flatMap((service) => [
      service.title,
      service.shortLabel,
      service.description,
    ]),
    normalizedSearch,
  );
  const historySectionMatches = matchesSearch(
    companyProfile.history.flatMap((item) => [item.year, item.title, item.copy]),
    normalizedSearch,
  );

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchSelect = (target) => {
    setIsSearchOpen(false);

    if (target.action) {
      target.action();
      return;
    }

    const element = document.getElementById(target.id);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (searchResults[0]) {
      handleSearchSelect(searchResults[0]);
    }
  };

  return (
    <div className="website-shell" id="top">
      <WebsiteBackground />

      <header className="website-topbar">
        <div className="website-topbar-main">
          <a className="website-brand" href="#top">
            <div className="website-brand-mark">{companyInitials}</div>
            <div className="website-brand-copy">
              <strong>Company Website</strong>
              <p>{supplier.companyName}</p>
              <span>{supplier.serviceCoverage}</span>
            </div>
          </a>

          <div className="website-toolbar">
            <div
              ref={searchRef}
              className={`website-search ${isSearchOpen ? "is-open" : ""}`.trim()}
            >
              <button
                type="button"
                className="website-search-toggle"
                aria-label={isSearchOpen ? "Close site search" : "Open site search"}
                aria-expanded={isSearchOpen}
                onClick={() => setIsSearchOpen((current) => !current)}
              >
                <SearchIcon />
              </button>

              {isSearchOpen ? (
                <form className="website-search-panel" role="search" onSubmit={handleSearchSubmit}>
                  <label className="website-search-field">
                    <SearchIcon />
                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchQuery}
                      placeholder="Search services, history, owner..."
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                  </label>

                  <div className="website-search-results">
                    {searchResults.length > 0 ? (
                      searchResults.map((target) => (
                        <button
                          key={`${target.type}-${target.id}`}
                          type="button"
                          className="website-search-result"
                          onClick={() => handleSearchSelect(target)}
                        >
                          <span>{target.type}</span>
                          <strong>{target.title}</strong>
                          <small>{target.subtitle}</small>
                        </button>
                      ))
                    ) : (
                      <p className="website-search-empty">
                        No matching result found. Try `solar`, `elevator`, or `history`.
                      </p>
                    )}
                  </div>
                </form>
              ) : null}
            </div>

            <button type="button" className="website-nav-cta" onClick={onStartEstimate}>
              Generate Estimate
            </button>
          </div>
        </div>

        <div className="website-topbar-nav">
          <nav className="website-nav">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#history">History</a>
          </nav>
          <p className="website-topbar-note">Solar, elevator, road, and travel support</p>
        </div>
      </header>

      <main className="website-main">
        <section className="website-hero">
          <div className="website-hero-copy">
            <p className="website-hero-eyebrow">Company Website</p>
            <h1>{companyProfile.heroTitle}</h1>
            <p className="website-hero-copy-text">{companyProfile.heroCopy}</p>

            <div className="website-hero-tags">
              {companyProfile.services.map((service) => (
                <span key={service.accent}>{service.shortLabel}</span>
              ))}
            </div>

            <div className="website-stat-grid">
              {companyStats.map((item) => (
                <CompanyStat key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          <div className="website-hero-visual">
            <div className="hero-orbit hero-orbit-sun" />
            <div className="hero-orbit hero-orbit-travel" />

            <div className="hero-visual-card hero-solar-card">
              <span className="hero-card-name">{heroServiceLabels.solar ?? "Solar"}</span>
              <div className="hero-solar-sun" />
              <div className="hero-solar-panel">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="hero-visual-card hero-elevator-card">
              <span className="hero-card-name">{heroServiceLabels.elevator ?? "Elevator"}</span>
              <div className="hero-elevator-shaft" />
              <div className="hero-elevator-cabin" />
            </div>

            <div className="hero-visual-card hero-road-card">
              <span className="hero-card-name">{heroServiceLabels.road ?? "Road"}</span>
              <div className="hero-road-surface" />
              <div className="hero-road-mark hero-road-mark-a" />
              <div className="hero-road-mark hero-road-mark-b" />
              <div className="hero-road-mark hero-road-mark-c" />
            </div>

            <div className="hero-visual-card hero-travel-card">
              <span className="hero-card-name">{heroServiceLabels.travel ?? "Travel"}</span>
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

        <section
          className={`website-section website-search-target ${aboutMatches ? "is-highlighted" : ""}`.trim()}
          id="about"
        >
          <SectionHeading
            eyebrow="About Company"
            title={companyProfile.aboutTitle}
            copy="Clients can explore the company background here, while the estimate generator remains a separate workflow."
          />

          <div className="about-grid">
            <article
              id="about-story"
              className={`about-card about-story-card website-search-target ${aboutMatches ? "is-highlighted" : ""}`.trim()}
            >
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

            <article
              id="about-owner"
              className={`about-card about-owner-card website-search-target ${ownerMatches ? "is-highlighted" : ""}`.trim()}
            >
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

        <section
          className={`website-section website-search-target ${servicesSectionMatches ? "is-highlighted" : ""}`.trim()}
          id="services"
        >
          <SectionHeading
            eyebrow="Core Services"
            title="Execution That Covers More Than One Industry"
            copy="A modern public website for the company, while the estimate generator stays available when the user is ready."
          />

          <div className="service-grid">
            {companyProfile.services.map((service) => (
              <ServiceCard
                key={service.title}
                id={`service-${service.accent}`}
                isHighlighted={matchesSearch(
                  [service.title, service.shortLabel, service.description],
                  normalizedSearch,
                )}
                service={service}
              />
            ))}
          </div>
        </section>

        <section
          className={`website-section website-search-target ${historySectionMatches ? "is-highlighted" : ""}`.trim()}
          id="history"
        >
          <SectionHeading
            eyebrow="Company History"
            title="A Growing Service Business Since 2022"
            copy="The website highlights credibility, coverage, and operational growth before a client enters the estimate flow."
          />

          <div className="history-grid">
            {companyProfile.history.map((item, index) => (
              <HistoryCard
                key={`${item.year}-${item.title}`}
                id={`history-${index}`}
                isHighlighted={matchesSearch([item.year, item.title, item.copy], normalizedSearch)}
                item={item}
              />
            ))}
          </div>
        </section>

        <section className="website-cta-panel">
          <div>
            <span>Estimate Studio</span>
            <h2>The header button stays ready whenever a client wants a quote.</h2>
            <p>
              The website now stays cleaner and more standard, while the sticky topbar keeps
              the `Generate Estimate` action available without repeating it all over the page.
            </p>
            <div className="website-cta-note">Header shortcut: Generate Estimate</div>
          </div>
        </section>
      </main>
    </div>
  );
}
