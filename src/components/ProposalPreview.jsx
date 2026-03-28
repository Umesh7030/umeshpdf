import ProposalChart from "./ProposalChart";
import {
  buildWelcomeParagraphs,
  formatCurrency,
  formatDate,
  formatNumber,
} from "../utils/proposalMath";

function ProposalPage({ className = "", children }) {
  return (
    <section className={`proposal-page ${className}`.trim()} data-proposal-page>
      {children}
    </section>
  );
}

function PageFooter({ supplierName, supplierWebsite }) {
  return (
    <footer className="proposal-footer">
      <span>{supplierName}</span>
      <span>{supplierWebsite || "Solar Rooftop Proposal"}</span>
    </footer>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function DetailTable({ title, rows }) {
  return (
    <div className="detail-table-card">
      <table className="detail-table">
        <thead>
          <tr>
            <th className="detail-table-index">Sr. No</th>
            <th colSpan="2">{title}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${title}-${row.label}-${index}`}>
              <td>{index + 1}</td>
              <td>{row.label}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <div className="metric-icon" aria-hidden="true">
        <span>{label.slice(0, 2).toUpperCase()}</span>
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function CoverStat({ label, value }) {
  return (
    <div className="cover-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CoverKeyValue({ label, value }) {
  return (
    <div className="cover-kv">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CoverProofItem({ label, value }) {
  return (
    <div className="cover-proof-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function ProposalPreview({ previewRef, proposal, derived }) {
  const welcomeParagraphs = buildWelcomeParagraphs(proposal);
  const rawServiceItems = proposal.supplier.serviceLine
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
  const firstServiceMatch = rawServiceItems[0]?.match(/^(.*?:)\s*(.*)$/);
  const serviceLabel = firstServiceMatch?.[1] ?? "Our Services:";
  const serviceItems = [
    firstServiceMatch?.[2] ?? rawServiceItems[0],
    ...rawServiceItems.slice(1),
  ].filter(Boolean);
  const coverHighlights = [
    {
      label: "Estimated Annual Savings",
      value: formatCurrency(derived.savings.annualSavings),
    },
    {
      label: "Projected Generation",
      value: `${formatNumber(derived.savings.yearlyGeneration)} Units / Year`,
    },
    {
      label: "Estimated Payback",
      value: `${derived.savings.paybackYears} Years`,
    },
  ];
  const companyProofs = [
    { label: "Established", value: `Since ${proposal.supplier.establishedYear}` },
    { label: "Track Record", value: proposal.supplier.installedCapacity },
    { label: "Client Base", value: proposal.supplier.clientsServed },
    { label: "Support", value: proposal.supplier.supportAvailability },
  ];

  return (
    <div className="proposal-stack" ref={previewRef}>
      <ProposalPage className="cover-page">
        <div className="cover-hero">
          <div className="cover-hero-copy">
            <div className="cover-badge">{proposal.project.coverBadge}</div>
            <p className="cover-headline">{proposal.project.coverHeadline}</p>
            <p className="cover-subheadline">{proposal.project.coverSubheadline}</p>

          </div>

          <aside className="cover-summary-panel">
            <p className="cover-summary-label">Proposal Snapshot</p>
            <div className="cover-summary-hero-stat">
              <span>Effective Project Cost</span>
              <strong>{formatCurrency(derived.commercial.effectiveCost)}</strong>
              <p>Estimated price after subsidy support.</p>
            </div>

            <div className="cover-summary-list">
              {coverHighlights.map((item) => (
                <CoverStat key={item.label} label={item.label} value={item.value} />
              ))}
            </div>

            <div className="cover-summary-footer">
              <span>Reference</span>
              <strong>{proposal.project.refNo}</strong>
            </div>
          </aside>
        </div>

        <div className="cover-content">
          <div className="cover-service-line" aria-label={proposal.supplier.serviceLine}>
            <strong>{serviceLabel}</strong>
            {serviceItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="cover-title-block">
            <div>
              <span>{proposal.project.coverTitle}</span>
              <h1>{proposal.project.proposalTitle}</h1>
            </div>
            <div className="cover-title-copy-block">
              <p className="cover-title-copy">
                Clear rooftop solar proposal with pricing, savings outlook, and
                dependable execution support for {proposal.customer.name}.
              </p>
              <div className="cover-proof-inline">
                <span>Since {proposal.supplier.establishedYear}</span>
                <span>{proposal.supplier.supportAvailability}</span>
              </div>
            </div>
          </div>

          <div className="cover-main-grid">
            <div className="cover-detail-card cover-client-card">
              <p className="cover-detail-label">Prepared For</p>
              <h3>{proposal.customer.name}</h3>
              <p>{proposal.customer.location}</p>
              <div className="cover-client-meta">
                <CoverKeyValue label="System Size" value={proposal.project.systemSize} />
                <CoverKeyValue
                  label="Proposal Date"
                  value={formatDate(proposal.project.proposalDate)}
                />
              </div>
            </div>

            <div className="cover-detail-card cover-company-card">
              <p className="cover-detail-label">Why Choose Us</p>
              <h3>{proposal.supplier.companyName}</h3>
              <p className="cover-company-lead">
                Established in {proposal.supplier.establishedYear} and trusted by
                clients across {proposal.supplier.serviceCoverage}.
              </p>
              <div className="cover-proof-grid">
                {companyProofs.map((item) => (
                  <CoverProofItem key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
              <p className="cover-company-promise">{proposal.supplier.companyPromise}</p>
              <p className="cover-proof-copy">
                Serving {proposal.supplier.serviceCoverage} with transparent proposals,
                responsive communication, and service-backed solar execution.
              </p>
              <div className="cover-company-contact">
                <span>{proposal.supplier.contactPerson}</span>
                <span>{proposal.supplier.phone}</span>
                <span>{proposal.supplier.website}</span>
              </div>
            </div>
          </div>
        </div>
      </ProposalPage>

      <ProposalPage className="content-page">
        <div className="page-accent" />
        <div className="page-body">
          <SectionHeading eyebrow="Welcome" title={proposal.customer.name} />
          <div className="proposal-meta">
            <p>
              <strong>Ref. No.:</strong> {proposal.project.refNo}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(proposal.project.proposalDate)}
            </p>
          </div>
          <div className="address-block">
            <p>To,</p>
            <p>
              <strong>{proposal.customer.name},</strong>
            </p>
            <p>{proposal.customer.location}</p>
          </div>
          <p className="proposal-subject">
            <strong>Sub:</strong> {proposal.project.subject}
          </p>
          <div className="letter-body">
            <p>
              Dear <strong>{proposal.customer.name},</strong>
            </p>
            {welcomeParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>Warm regards,</p>
            <p>
              {proposal.supplier.contactPerson}
              <br />
              {proposal.supplier.companyName}
              <br />
              M: {proposal.supplier.phone}
              <br />
              E: {proposal.supplier.email}
            </p>
          </div>
        </div>
        <PageFooter
          supplierName={proposal.supplier.companyName}
          supplierWebsite={proposal.supplier.website}
        />
      </ProposalPage>

      <ProposalPage className="content-page">
        <div className="page-accent" />
        <div className="page-body">
          <SectionHeading eyebrow="Bill of" title="Material" />
          <div className="bom-grid">
            <DetailTable title="Panel Details" rows={proposal.materialTables.panel} />
            <DetailTable
              title="Inverter Details"
              rows={proposal.materialTables.inverter}
            />
            <DetailTable title="Cable Details" rows={proposal.materialTables.cable} />
            <DetailTable
              title="Structure Details"
              rows={proposal.materialTables.structure}
            />
          </div>

          <div className="bos-card">
            <div className="bos-card-heading">Balance of System</div>
            <ul>
              {proposal.materialTables.balanceOfSystem.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
            <div className="bos-warranty-row">
              <span>BOS Warranty</span>
              <strong>{proposal.materialTables.bosWarranty}</strong>
            </div>
          </div>
        </div>
        <PageFooter
          supplierName={proposal.supplier.companyName}
          supplierWebsite={proposal.supplier.website}
        />
      </ProposalPage>

      <ProposalPage className="content-page">
        <div className="page-accent" />
        <div className="page-body">
          <SectionHeading eyebrow="Commercial" title="Offer" />
          <p className="section-intro">
            Price quote and payment schedule for {proposal.project.systemSize} grid tie
            rooftop solar system:
          </p>

          <table className="commercial-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Price</th>
                <th>GST Rate</th>
                <th>GST</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {derived.commercial.rows.map((row, index) => (
                <tr key={`${row.description}-${index}`}>
                  <td>{row.description}</td>
                  <td>{formatNumber(row.price)}</td>
                  <td>{row.gstRate.toFixed(2)}%</td>
                  <td>{formatNumber(row.gstAmount)}</td>
                  <td>{formatNumber(row.totalPrice)}</td>
                </tr>
              ))}
              <tr className="commercial-highlight-row">
                <td>Cost to Customer</td>
                <td colSpan="3" />
                <td>{formatNumber(derived.commercial.costToCustomer)}</td>
              </tr>
              <tr className="commercial-highlight-row">
                <td>MNRE Subsidy</td>
                <td colSpan="3" />
                <td>{formatNumber(derived.commercial.subsidy)}</td>
              </tr>
              <tr className="commercial-highlight-row">
                <td>Effective Cost After Subsidy</td>
                <td colSpan="3" />
                <td>{formatNumber(derived.commercial.effectiveCost)}</td>
              </tr>
            </tbody>
          </table>

          <p className="commercial-note">{proposal.commercial.structureHeightNote}</p>

          <div className="payment-layout">
            <div>
              <h3>Payment Terms</h3>
              <ol>
                {proposal.commercial.paymentTerms.map((term, index) => (
                  <li key={`${term}-${index}`}>{term}</li>
                ))}
              </ol>
              <p>
                <strong>Payment mode:</strong> {proposal.commercial.paymentMode}
              </p>
            </div>

            <div>
              <h3>Payment Details</h3>
              <p>{proposal.commercial.paymentIntro}</p>
              <p>Account number: {proposal.supplier.accountNumber}</p>
              <p>IFSC: {proposal.supplier.ifsc}</p>
              <p>SWIFT code: {proposal.supplier.swiftCode}</p>
              <p>Bank name: {proposal.supplier.bankName}</p>
              <p>Branch: {proposal.supplier.branch}</p>
            </div>
          </div>
        </div>
        <PageFooter
          supplierName={proposal.supplier.companyName}
          supplierWebsite={proposal.supplier.website}
        />
      </ProposalPage>

      <ProposalPage className="content-page">
        <div className="page-accent" />
        <div className="page-body">
          <SectionHeading eyebrow="Your" title="Solar Savings" />

          <div className="metrics-grid">
            <MetricCard
              label="Payback Period"
              value={`${derived.savings.paybackYears} Years`}
            />
            <MetricCard
              label="Average Yearly Generation"
              value={`${formatNumber(derived.savings.yearlyGeneration)} Units`}
            />
            <MetricCard
              label="Average Annual Savings"
              value={formatCurrency(derived.savings.annualSavings)}
            />
            <MetricCard
              label="Project Cost"
              value={formatCurrency(derived.savings.projectCost)}
            />
            <MetricCard
              label="Trees Saved"
              value={formatNumber(derived.savings.treesSaved)}
            />
            <MetricCard
              label="CO2 Reduction"
              value={`${formatNumber(derived.savings.co2Reduction)} Tonnes`}
            />
          </div>

          <div className="chart-shell">
            <h3>Monthly Generation & Savings</h3>
            <ProposalChart monthlyMetrics={proposal.savings.monthlyMetrics} />
          </div>
        </div>
        <PageFooter
          supplierName={proposal.supplier.companyName}
          supplierWebsite={proposal.supplier.website}
        />
      </ProposalPage>

      <ProposalPage className="content-page">
        <div className="page-accent" />
        <div className="page-body">
          <SectionHeading eyebrow="Scope of" title="Works" />

          <div className="scope-block">
            <h3>Our Scope</h3>
            <p>{proposal.scope.ourScope}</p>
          </div>

          <div className="scope-block">
            <h3>Customer Scope</h3>
            <p>{proposal.scope.customerScope}</p>
          </div>

          <div className="scope-block">
            <SectionHeading eyebrow="Terms &" title="Conditions" />
            <ul className="terms-list">
              {proposal.scope.terms.map((term, index) => (
                <li key={`${term}-${index}`}>{term}</li>
              ))}
            </ul>
          </div>
        </div>
        <PageFooter
          supplierName={proposal.supplier.companyName}
          supplierWebsite={proposal.supplier.website}
        />
      </ProposalPage>

      <ProposalPage className="contact-page">
        <div className="contact-page-top" />
        <div className="contact-card">
          <div className="contact-mark">
            <span>A</span>
          </div>
          <div>
            <p className="contact-overline">{proposal.supplier.companyName}</p>
            <h2>Contact Us for Further Details</h2>
          </div>
          <div className="contact-details">
            <p>
              <strong>Address:</strong> {proposal.supplier.addressLine1}
            </p>
            <p>{proposal.supplier.addressLine2}</p>
            <p>
              <strong>Contact:</strong> {proposal.supplier.contactPerson}
            </p>
            <p>
              <strong>Phone:</strong> {proposal.supplier.phone}
            </p>
            <p>
              <strong>Mail:</strong> {proposal.supplier.email}
            </p>
            <p>
              <strong>Web:</strong> {proposal.supplier.website}
            </p>
            <p>
              <strong>GSTIN:</strong> {proposal.supplier.gstin}
            </p>
          </div>
        </div>
        <div className="contact-page-bottom" />
      </ProposalPage>
    </div>
  );
}
