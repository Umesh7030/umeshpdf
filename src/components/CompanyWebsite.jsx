import { useEffect, useRef, useState } from "react";
import { interactiveServiceKeys } from "../data/serviceFlows";

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

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.75 3.5h8.5A4.75 4.75 0 0 1 21 8.25v7.5a4.75 4.75 0 0 1-4.75 4.75h-8.5A4.75 4.75 0 0 1 3 15.75v-7.5A4.75 4.75 0 0 1 7.75 3.5Zm0 1.5A3.25 3.25 0 0 0 4.5 8.25v7.5A3.25 3.25 0 0 0 7.75 19h8.5a3.25 3.25 0 0 0 3.25-3.25v-7.5A3.25 3.25 0 0 0 16.25 5h-8.5Zm8.9 1.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M13.24 20.5v-7.18h2.42l.36-2.81h-2.78V8.72c0-.81.22-1.37 1.39-1.37h1.49V4.84c-.26-.03-1.15-.1-2.19-.1-2.17 0-3.65 1.32-3.65 3.75v2.02H8.09v2.81h2.29v7.18h2.86Z"
        fill="currentColor"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21.27 7.2a2.95 2.95 0 0 0-2.08-2.08C17.35 4.63 12 4.63 12 4.63s-5.35 0-7.19.49A2.95 2.95 0 0 0 2.73 7.2C2.25 9.04 2.25 12 2.25 12s0 2.96.48 4.8a2.95 2.95 0 0 0 2.08 2.08c1.84.49 7.19.49 7.19.49s5.35 0 7.19-.49a2.95 2.95 0 0 0 2.08-2.08c.48-1.84.48-4.8.48-4.8s0-2.96-.48-4.8ZM10.25 15.12V8.88L15.68 12l-5.43 3.12Z"
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

function ServiceCard({ id, isHighlighted, onClick, service }) {
  const isClickable = typeof onClick === "function";
  const className =
    `service-card website-search-target ${isHighlighted ? "is-highlighted" : ""} ${
      isClickable ? "is-clickable" : ""
    }`.trim();
  const content = (
    <>
      <ServiceMotion accent={service.accent} />
      <span className="service-card-label">{service.shortLabel}</span>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      {isClickable ? <span className="service-card-action">Select role</span> : null}
    </>
  );

  if (isClickable) {
    return (
      <button id={id} type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <article id={id} className={className}>
      {content}
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

export default function CompanyWebsite({ proposal, onOpenService }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const { supplier, companyProfile } = proposal;
  const currentYear = new Date().getFullYear();
  const companyStats = [
    { label: "Established", value: `Since ${supplier.establishedYear}` },
    { label: "Installed Capacity", value: supplier.installedCapacity },
    { label: "Clients", value: supplier.clientsServed },
    { label: "Support", value: supplier.supportAvailability },
  ];
  const heroServiceLabels = Object.fromEntries(
    companyProfile.services.map((service) => [service.accent, service.shortLabel]),
  );
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
  const socialLinks = [
    {
      platform: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/pratikmore4133?igsh=MWxidDNxMGRzaHVk",
      icon: <InstagramIcon />,
    },
    {
      platform: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/share/178Bs6e9r2/",
      icon: <FacebookIcon />,
    },
    {
      platform: "youtube",
      label: "YouTube",
      href: "",
      icon: <YouTubeIcon />,
    },
  ];

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
            <div className="website-brand-mark" aria-hidden="true">
              <div className="website-brand-mark-sun" />
              <div className="website-brand-mark-rays">
                <span />
                <span />
                <span />
              </div>
              <div className="website-brand-mark-panel">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="website-brand-copy">
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
                <span className="website-search-toggle-label">Search</span>
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
            copy="Choose a service to continue as admin or customer, while keeping the public website experience clean and simple."
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
                onClick={
                  interactiveServiceKeys.includes(service.accent)
                    ? () => onOpenService(service.accent)
                    : undefined
                }
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
            <span>Why Choose Us</span>
            <h2>Smart energy planning, strong execution, and dependable support for every project.</h2>
            <p>
              Deshmukh Infra & Energy Solutions brings together solar expertise,
              infrastructure coordination, and responsive field support to deliver
              projects with safety, clarity, and long-term value. We believe every
              client deserves honest guidance, quality workmanship, and service that
              continues even after project completion.
            </p>
            <div className="website-cta-note">Trusted execution. Sustainable results.</div>
          </div>
        </section>
      </main>

      <footer className="website-footer">
        <div className="website-footer-copy">
          <span>Thank You</span>
          <h2>Thank you for visiting our website.</h2>
          <p>
            We appreciate your time and interest in Deshmukh Infra & Energy Solutions.
            Our team is committed to delivering reliable service, practical solutions,
            and long-term support for every client.
          </p>
        </div>

        <div className="website-footer-social">
          <p>Follow Us</p>
          <div className="website-social-links">
            {socialLinks.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  className="website-social-link"
                  data-platform={item.platform}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  title={item.label}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ) : (
                <div
                  key={item.label}
                  className="website-social-link is-disabled"
                  data-platform={item.platform}
                  aria-label={`${item.label} coming soon`}
                  title={`${item.label} coming soon`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="website-footer-bottom">
          <p>
            Copyright {currentYear} {supplier.companyName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
