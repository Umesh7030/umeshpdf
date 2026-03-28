function Field({ label, value, onChange, type = "text", step, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        step={step}
        placeholder={placeholder}
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, rows = 3 }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function EditorCard({ title, children, open = true }) {
  return (
    <details className="editor-card" open={open}>
      <summary>{title}</summary>
      <div className="editor-card-body">{children}</div>
    </details>
  );
}

function TableEditor({ title, rows, onChange, onAdd, onRemove }) {
  return (
    <div className="subeditor">
      <div className="subeditor-header">
        <h4>{title}</h4>
        <button type="button" className="secondary-button small-button" onClick={onAdd}>
          Add Row
        </button>
      </div>
      <div className="editor-list">
        {rows.map((row, index) => (
          <div className="editor-list-item" key={`${title}-${index}`}>
            <Field
              label="Label"
              value={row.label}
              onChange={(value) => onChange(index, "label", value)}
            />
            <Field
              label="Value"
              value={row.value}
              onChange={(value) => onChange(index, "value", value)}
            />
            <button
              type="button"
              className="ghost-button small-button"
              onClick={() => onRemove(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StringListEditor({ title, items, onChange, onAdd, onRemove }) {
  return (
    <div className="subeditor">
      <div className="subeditor-header">
        <h4>{title}</h4>
        <button type="button" className="secondary-button small-button" onClick={onAdd}>
          Add Item
        </button>
      </div>
      <div className="editor-list">
        {items.map((item, index) => (
          <div className="editor-list-item stack" key={`${title}-${index}`}>
            <TextAreaField
              label={`${title} ${index + 1}`}
              value={item}
              onChange={(value) => onChange(index, value)}
              rows={2}
            />
            <button
              type="button"
              className="ghost-button small-button"
              onClick={() => onRemove(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const buildProposalReference = (customerName, proposalDate) => {
  const initials = customerName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
  const dateToken = proposalDate ? proposalDate.replaceAll("-", "").slice(2) : "000000";

  return `DSS-${initials || "CL"}-${dateToken || "000000"}`;
};

const buildProposalSubject = (systemSize) =>
  `Proposal for supply, installation, and commissioning of a ${systemSize} grid-connected rooftop solar power system.`;

export default function EditorPanel({
  proposal,
  setProposal,
  derived,
  statusMessage,
  isGenerating,
  onGenerate,
  onDownload,
  onShare,
  onReset,
}) {
  const updateSectionField = (section, field, value) => {
    setProposal((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  };

  const updateCustomerField = (field, value) => {
    setProposal((current) => {
      const nextCustomer = {
        ...current.customer,
        [field]: value,
      };

      return {
        ...current,
        customer: nextCustomer,
        project: {
          ...current.project,
          refNo: buildProposalReference(nextCustomer.name, current.project.proposalDate),
        },
      };
    });
  };

  const updateProposalField = (field, value) => {
    setProposal((current) => {
      const nextProject = {
        ...current.project,
        [field]: value,
      };

      if (field === "systemSize") {
        nextProject.coverTitle = `${value} Solar`;
        nextProject.subject = buildProposalSubject(value);
      }

      if (field === "proposalDate") {
        nextProject.refNo = buildProposalReference(current.customer.name, value);
      }

      return {
        ...current,
        project: nextProject,
      };
    });
  };

  const updateMaterialRow = (tableName, rowIndex, field, value) => {
    setProposal((current) => ({
      ...current,
      materialTables: {
        ...current.materialTables,
        [tableName]: current.materialTables[tableName].map((row, index) =>
          index === rowIndex ? { ...row, [field]: value } : row,
        ),
      },
    }));
  };

  const addMaterialRow = (tableName) => {
    setProposal((current) => ({
      ...current,
      materialTables: {
        ...current.materialTables,
        [tableName]: [...current.materialTables[tableName], { label: "New item", value: "" }],
      },
    }));
  };

  const removeMaterialRow = (tableName, rowIndex) => {
    setProposal((current) => ({
      ...current,
      materialTables: {
        ...current.materialTables,
        [tableName]:
          current.materialTables[tableName].length > 1
            ? current.materialTables[tableName].filter((_, index) => index !== rowIndex)
            : current.materialTables[tableName],
      },
    }));
  };

  const updateStringList = (section, key, itemIndex, value) => {
    setProposal((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: current[section][key].map((item, index) =>
          index === itemIndex ? value : item,
        ),
      },
    }));
  };

  const addStringListItem = (section, key, fallbackValue) => {
    setProposal((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: [...current[section][key], fallbackValue],
      },
    }));
  };

  const removeStringListItem = (section, key, itemIndex) => {
    setProposal((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]:
          current[section][key].length > 1
            ? current[section][key].filter((_, index) => index !== itemIndex)
            : current[section][key],
      },
    }));
  };

  const updateCommercialRow = (rowIndex, field, value) => {
    setProposal((current) => ({
      ...current,
      commercial: {
        ...current.commercial,
        rows: current.commercial.rows.map((row, index) =>
          index === rowIndex ? { ...row, [field]: value } : row,
        ),
      },
    }));
  };

  const addCommercialRow = () => {
    setProposal((current) => ({
      ...current,
      commercial: {
        ...current.commercial,
        rows: [
          ...current.commercial.rows,
          {
            description: "New line item",
            price: "0",
            gstRate: "0",
          },
        ],
      },
    }));
  };

  const removeCommercialRow = (rowIndex) => {
    setProposal((current) => ({
      ...current,
      commercial: {
        ...current.commercial,
        rows:
          current.commercial.rows.length > 1
            ? current.commercial.rows.filter((_, index) => index !== rowIndex)
            : current.commercial.rows,
      },
    }));
  };

  return (
    <aside className="editor-shell">
      <div className="editor-header">
        <div>
          <p className="eyebrow">Assistant Editor</p>
          <h1>Deshmukh Solar Proposal Studio</h1>
          <p className="editor-copy">
            Only client and estimate fields are editable here. Company details,
            payment details, and terms stay locked so your assistant can work safely.
          </p>
        </div>
        <button type="button" className="ghost-button" onClick={onReset}>
          Reset Template
        </button>
      </div>

      <div className="action-panel">
        <button type="button" className="primary-button" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate PDF"}
        </button>
        <button type="button" className="secondary-button" onClick={onDownload} disabled={isGenerating}>
          Download PDF
        </button>
        <button type="button" className="secondary-button" onClick={onShare} disabled={isGenerating}>
          Share PDF
        </button>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <span>Client</span>
          <strong>{proposal.customer.name}</strong>
        </div>
        <div className="summary-card">
          <span>System Size</span>
          <strong>{proposal.project.systemSize}</strong>
        </div>
        <div className="summary-card">
          <span>Cost to Customer</span>
          <strong>Rs. {derived.commercial.costToCustomer.toLocaleString("en-IN")}</strong>
        </div>
        <div className="summary-card">
          <span>Effective Cost</span>
          <strong>Rs. {derived.commercial.effectiveCost.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      {statusMessage ? <p className="status-banner">{statusMessage}</p> : null}

      <div className="locked-panel">
        <p className="locked-panel-label">Locked Company Details</p>
        <strong>{proposal.supplier.companyName}</strong>
        <p>
          {proposal.supplier.contactPerson} | {proposal.supplier.phone}
        </p>
        <p>
          Owner profile, payment details, scope, and terms are fixed and cannot be
          changed by the assistant.
        </p>
      </div>

      <EditorCard title="Client Details">
        <p className="editor-note">
          Change only the client name, address, system size, and date. The proposal
          reference is generated automatically.
        </p>
        <div className="field-grid two-column">
          <Field
            label="Client Name"
            value={proposal.customer.name}
            onChange={(value) => updateCustomerField("name", value)}
            placeholder="Enter client name"
          />
          <Field
            label="Client Address / Location"
            value={proposal.customer.location}
            onChange={(value) => updateCustomerField("location", value)}
            placeholder="Enter client address"
          />
          <Field
            label="System Size"
            value={proposal.project.systemSize}
            onChange={(value) => updateProposalField("systemSize", value)}
            placeholder="3.5 kW"
          />
          <Field
            label="Proposal Date"
            type="date"
            value={proposal.project.proposalDate}
            onChange={(value) => updateProposalField("proposalDate", value)}
          />
        </div>
        <div className="quick-reference-card">
          <span>Auto Proposal Reference</span>
          <strong>{proposal.project.refNo}</strong>
        </div>
      </EditorCard>

      <EditorCard title="Bill of Material" open={false}>
        <p className="editor-note">
          Add, remove, or rename components so each client estimate matches the
          actual site requirement.
        </p>
        <TableEditor
          title="Panel Details"
          rows={proposal.materialTables.panel}
          onChange={(index, field, value) => updateMaterialRow("panel", index, field, value)}
          onAdd={() => addMaterialRow("panel")}
          onRemove={(index) => removeMaterialRow("panel", index)}
        />
        <TableEditor
          title="Inverter Details"
          rows={proposal.materialTables.inverter}
          onChange={(index, field, value) => updateMaterialRow("inverter", index, field, value)}
          onAdd={() => addMaterialRow("inverter")}
          onRemove={(index) => removeMaterialRow("inverter", index)}
        />
        <TableEditor
          title="Cable Details"
          rows={proposal.materialTables.cable}
          onChange={(index, field, value) => updateMaterialRow("cable", index, field, value)}
          onAdd={() => addMaterialRow("cable")}
          onRemove={(index) => removeMaterialRow("cable", index)}
        />
        <TableEditor
          title="Structure Details"
          rows={proposal.materialTables.structure}
          onChange={(index, field, value) => updateMaterialRow("structure", index, field, value)}
          onAdd={() => addMaterialRow("structure")}
          onRemove={(index) => removeMaterialRow("structure", index)}
        />
        <StringListEditor
          title="Balance of System"
          items={proposal.materialTables.balanceOfSystem}
          onChange={(index, value) =>
            updateStringList("materialTables", "balanceOfSystem", index, value)
          }
          onAdd={() =>
            addStringListItem(
              "materialTables",
              "balanceOfSystem",
              "New balance of system item",
            )
          }
          onRemove={(index) => removeStringListItem("materialTables", "balanceOfSystem", index)}
        />
        <Field
          label="BOS Warranty"
          value={proposal.materialTables.bosWarranty}
          onChange={(value) =>
            setProposal((current) => ({
              ...current,
              materialTables: {
                ...current.materialTables,
                bosWarranty: value,
              },
            }))
          }
        />
      </EditorCard>

      <EditorCard title="Estimate & Pricing" open={false}>
        <p className="editor-note">
          Add or remove estimate rows whenever you need to include extra equipment,
          structure work, transport, or service charges.
        </p>
        <div className="subeditor">
          <div className="subeditor-header">
            <h4>Estimate Rows</h4>
            <button type="button" className="secondary-button small-button" onClick={addCommercialRow}>
              Add Item
            </button>
          </div>
          <div className="editor-list">
            {proposal.commercial.rows.map((row, index) => (
              <div className="editor-list-item" key={`commercial-${index}`}>
                <Field
                  label="Description"
                  value={row.description}
                  onChange={(value) => updateCommercialRow(index, "description", value)}
                />
                <Field
                  label="Price"
                  value={row.price}
                  type="number"
                  step="0.01"
                  onChange={(value) => updateCommercialRow(index, "price", value)}
                />
                <Field
                  label="GST Rate (%)"
                  value={row.gstRate}
                  type="number"
                  step="0.01"
                  onChange={(value) => updateCommercialRow(index, "gstRate", value)}
                />
                <button
                  type="button"
                  className="ghost-button small-button"
                  onClick={() => removeCommercialRow(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="field-grid two-column">
          <Field
            label="Subsidy"
            type="number"
            step="0.01"
            value={proposal.commercial.subsidy}
            onChange={(value) => updateSectionField("commercial", "subsidy", value)}
          />
        </div>
        <TextAreaField
          label="Structure / Site Note"
          value={proposal.commercial.structureHeightNote}
          onChange={(value) => updateSectionField("commercial", "structureHeightNote", value)}
          rows={2}
        />
      </EditorCard>
    </aside>
  );
}
