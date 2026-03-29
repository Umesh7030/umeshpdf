import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function ServicePageLayout({
  backLabel = "Back to Website",
  backTo = "/home",
  children,
  description,
  eyebrow,
  headerClassName = "",
  mainClassName = "",
  pageClassName = "",
  title,
}) {
  const navigate = useNavigate();

  return (
    <div className={["service-page-shell", pageClassName].filter(Boolean).join(" ")}>
      <header className={["service-page-header", headerClassName].filter(Boolean).join(" ")}>
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

      <main className={["service-page-main", mainClassName].filter(Boolean).join(" ")}>
        {children}
      </main>
    </div>
  );
}
