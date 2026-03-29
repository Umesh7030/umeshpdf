import { useState } from "react";
import EditorPanel from "./EditorPanel";
import ProposalPreview from "./ProposalPreview";

export default function EstimatorStudio({
  derived,
  isGenerating,
  onBack,
  onDownload,
  onGenerate,
  onReset,
  onShare,
  previewRef,
  proposal,
  setProposal,
  statusMessage,
}) {
  const [mobilePanel, setMobilePanel] = useState("editor");

  return (
    <div className="estimator-shell">
      <header className="estimator-topbar">
        <div>
          <p className="eyebrow">Estimate Studio</p>
          <h1>{proposal.supplier.companyName}</h1>
        </div>
        <div className="estimator-topbar-actions">
          <button type="button" className="ghost-button" onClick={onBack}>
            Back to Website
          </button>
        </div>
      </header>

      <main className="app-shell">
        <div className="mobile-panel-switch" aria-label="Mobile view switch">
          <button
            type="button"
            className={`mobile-panel-button ${mobilePanel === "editor" ? "is-active" : ""}`.trim()}
            onClick={() => setMobilePanel("editor")}
          >
            Edit
          </button>
          <button
            type="button"
            className={`mobile-panel-button ${mobilePanel === "preview" ? "is-active" : ""}`.trim()}
            onClick={() => setMobilePanel("preview")}
          >
            Preview
          </button>
        </div>

        <div className={`editor-region ${mobilePanel === "editor" ? "mobile-active" : ""}`.trim()}>
          <EditorPanel
            proposal={proposal}
            setProposal={setProposal}
            derived={derived}
            statusMessage={statusMessage}
            isGenerating={isGenerating}
            onGenerate={onGenerate}
            onDownload={onDownload}
            onShare={onShare}
            onReset={onReset}
          />
        </div>

        <div className={`preview-region ${mobilePanel === "preview" ? "mobile-active" : ""}`.trim()}>
          <div className="preview-shell">
            <div className="preview-header">
              <div>
                <p className="eyebrow">Live Preview</p>
                <h2>Client-ready solar proposal</h2>
                <p>
                  Every client detail, BOM update, and price change is reflected here
                  before you generate the final PDF.
                </p>
              </div>
            </div>

            <ProposalPreview previewRef={previewRef} proposal={proposal} derived={derived} />
          </div>
        </div>
      </main>
    </div>
  );
}
