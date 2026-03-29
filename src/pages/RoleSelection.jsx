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
      eyebrow={serviceFlow.eyebrow}
      title={serviceFlow.title}
      description={serviceFlow.description}
      backTo="/"
    >
      <section className="service-form-card role-selection-panel">
        <div className="service-form-heading">
          <h2>Select Your Role</h2>
          <p>Continue with the workflow that best matches how you want to proceed.</p>
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
                {role.disabled ? "Coming Soon" : `Continue as ${role.label}`}
              </Button>
            </article>
          ))}
        </div>
      </section>
    </ServicePageLayout>
  );
}
