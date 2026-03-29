import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CompanyWebsite from "./components/CompanyWebsite";
import EstimatorStudio from "./components/EstimatorStudio";
import { createProposalDraft } from "./data/proposalTemplate";
import ElevatorCustomerForm from "./pages/ElevatorCustomerForm";
import ElevatorEstimateAdmin from "./pages/ElevatorEstimateAdmin";
import RoleSelection from "./pages/RoleSelection";
import SolarCustomerForm from "./pages/SolarCustomerForm";
import TravelCustomerForm from "./pages/TravelCustomerForm";
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
  const previewRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const commercial = buildCommercialSummary(proposal.commercial);
  const savings = buildSavingsSummary(proposal, commercial);
  const derived = { commercial, savings };

  useEffect(() => {
    setPdfBlob(null);
  }, [proposal]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

  return (
    <Routes>
      <Route
        path="/"
        element={
          <CompanyWebsite
            proposal={proposal}
            onOpenService={(serviceKey) => navigate(`/services/${serviceKey}`)}
          />
        }
      />
      <Route path="/services/:serviceKey" element={<RoleSelection />} />
      <Route
        path="/solar/admin"
        element={
          <EstimatorStudio
            derived={derived}
            isGenerating={isGenerating}
            onBack={() => navigate("/")}
            onDownload={handleDownload}
            onGenerate={handleGenerate}
            onReset={handleReset}
            onShare={handleShare}
            previewRef={previewRef}
            proposal={proposal}
            setProposal={setProposal}
            statusMessage={statusMessage}
          />
        }
      />
      <Route path="/solar/customer" element={<SolarCustomerForm />} />
      <Route path="/elevator/admin" element={<ElevatorEstimateAdmin />} />
      <Route path="/elevator/customer" element={<ElevatorCustomerForm />} />
      <Route path="/travel/customer" element={<TravelCustomerForm />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
