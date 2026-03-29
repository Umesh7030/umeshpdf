import { Navigate, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import ServicePageLayout from "../components/ServicePageLayout";
import { getServiceFlow } from "../data/serviceFlows";

export default function RoleSelection() {
  const navigate = useNavigate();
  const { serviceKey } = useParams();
  const serviceFlow = getServiceFlow(serviceKey);

  if (!serviceFlow) {
    return <Navigate replace to="/" />;
  }

  const roles = Object.entries(serviceFlow.roles);

  return (
    <ServicePageLayout
      pageClassName="role-selection-page"
      eyebrow={serviceFlow.eyebrow}
      title={serviceFlow.title}
      description={serviceFlow.description}
      backTo="/"
      backLabel="Back"
    >
      <section className="service-form-card role-selection-panel">
        <div className="service-form-heading">
          <h2>Select Your Role</h2>
          <p>Pick how you want to continue.</p>
        </div>

        <div className="role-grid">
          {roles.map(([roleKey, role]) => (
            <article
              key={roleKey}
              className={`role-card ${role.disabled ? "is-disabled" : ""}`.trim()}
            >
              <span className="role-card-label">{role.label}</span>
              <h3>{role.label}</h3>
              <p>{role.description}</p>
              <Button
                fullWidth
                variant={roleKey === "admin" ? "secondary" : "primary"}
                disabled={role.disabled}
                onClick={() => role.path && navigate(role.path)}
              >
                {role.disabled ? "Soon" : "Continue"}
              </Button>
            </article>
          ))}
        </div>

        <div className="role-selection-visual">
          <img
            src="/images/client-support-team.jpg"
            alt="Customer support executive discussing service options with a client"
          />
          <div className="role-selection-visual-copy">
            <span>Client Support</span>
            <strong>Clear discussions, quick guidance, and practical help for every enquiry.</strong>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
