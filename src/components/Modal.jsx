import { useEffect } from "react";
import Button from "./Button";

export default function Modal({
  actionLabel = "Close",
  isOpen,
  message,
  onClose,
  title = "Success",
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        aria-modal="true"
        aria-labelledby="app-modal-title"
        className="modal-card"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="eyebrow">Notification</p>
        <h2 id="app-modal-title">{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <Button onClick={onClose}>{actionLabel}</Button>
        </div>
      </div>
    </div>
  );
}
