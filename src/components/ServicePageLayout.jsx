import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function ServicePageLayout({
  backLabel = "Back to Website",
  backTo = "/",
  children,
  description,
  eyebrow,
  title,
}) {
  const navigate = useNavigate();

  return (
    <div className="service-page-shell">
      <header className="service-page-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {description ? <p className="service-page-copy">{description}</p> : null}
        </div>

        <div className="service-page-header-actions">
          <Button variant="ghost" onClick={() => navigate(backTo)}>
            {backLabel}
          </Button>
        </div>
      </header>

      <main className="service-page-main">{children}</main>
    </div>
  );
}
