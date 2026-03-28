import { useEffect, useRef, useState } from "react";
import CompanyWebsite from "./components/CompanyWebsite";
import EditorPanel from "./components/EditorPanel";
import ProposalPreview from "./components/ProposalPreview";
import { createProposalDraft } from "./data/proposalTemplate";
import {
  buildCommercialSummary,
  buildFileName,
  buildSavingsSummary,
} from "./utils/proposalMath";

export default function App() {
  const [proposal, setProposal] = useState(createProposalDraft);
  const [statusMessage, setStatusMessage] = useState(
    "Proposal studio ready. Change only client details, bill items, and pricing before export.",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [mobilePanel, setMobilePanel] = useState("editor");
  const [appView, setAppView] = useState("website");
  const previewRef = useRef(null);

  const commercial = buildCommercialSummary(proposal.commercial);
  const savings = buildSavingsSummary(proposal, commercial);
  const derived = { commercial, savings };

  useEffect(() => {
    setPdfBlob(null);
  }, [proposal]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appView]);

  const renderProposalPdf = async () => {
    if (!previewRef.current) {
      return null;
    }

    setIsGenerating(true);
    setStatusMessage("Generating PDF from the live proposal preview...");

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const pages = Array.from(
        previewRef.current.querySelectorAll("[data-proposal-page]"),
      );
      const document = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
        compress: true,
      });

      for (let index = 0; index < pages.length; index += 1) {
        const canvas = await html2canvas(pages[index], {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
        });
        const pageImage = canvas.toDataURL("image/png");
        const pdfWidth = document.internal.pageSize.getWidth();
        const pdfHeight = document.internal.pageSize.getHeight();

        if (index > 0) {
          document.addPage();
        }

        document.addImage(pageImage, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      }

      const blob = document.output("blob");
      setPdfBlob(blob);
      setStatusMessage("PDF is ready. You can now download or share it.");
      return blob;
    } catch (error) {
      console.error(error);
      setStatusMessage("PDF generation failed. Please try again.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const ensurePdfBlob = async () => pdfBlob ?? renderProposalPdf();

  const downloadBlob = (blob) => {
    const fileName = buildFileName(proposal);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(objectUrl);
  };

  const handleGenerate = async () => {
    await renderProposalPdf();
  };

  const handleDownload = async () => {
    const blob = await ensurePdfBlob();
    if (!blob) {
      return;
    }

    downloadBlob(blob);
    setStatusMessage("PDF downloaded successfully.");
  };

  const handleShare = async () => {
    const blob = await ensurePdfBlob();
    if (!blob) {
      return;
    }

    const file = new File([blob], buildFileName(proposal), {
      type: "application/pdf",
    });

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${proposal.project.coverTitle} Proposal`,
          text: `Proposal for ${proposal.customer.name}`,
        });
        setStatusMessage("PDF shared successfully.");
        return;
      } catch (error) {
        if (error?.name === "AbortError") {
          setStatusMessage("Share was cancelled.");
          return;
        }
      }
    }

    downloadBlob(blob);
    setStatusMessage("File sharing is not available in this browser, so the PDF was downloaded instead.");
  };

  const handleReset = () => {
    setProposal(createProposalDraft());
    setStatusMessage("Proposal template reset to the locked company profile and default client values.");
  };

  const openEstimator = () => {
    setMobilePanel("editor");
    setAppView("estimator");
  };

  if (appView === "website") {
    return (
      <CompanyWebsite proposal={proposal} onStartEstimate={openEstimator} />
    );
  }

  return (
    <div className="estimator-shell">
      <header className="estimator-topbar">
        <div>
          <p className="eyebrow">Estimate Studio</p>
          <h1>{proposal.supplier.companyName}</h1>
        </div>
        <div className="estimator-topbar-actions">
          <button type="button" className="ghost-button" onClick={() => setAppView("website")}>
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
            onGenerate={handleGenerate}
            onDownload={handleDownload}
            onShare={handleShare}
            onReset={handleReset}
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
