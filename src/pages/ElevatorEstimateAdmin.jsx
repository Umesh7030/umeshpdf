import { useState } from "react";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import Modal from "../components/Modal";
import ServicePageLayout from "../components/ServicePageLayout";
import { validateRequiredFields, wait } from "../utils/formHelpers";

const componentOptions = [
  {
    label: "Lift Cabin",
    value: "lift-cabin",
    description: "Cabin interiors, operating panel, and finishing details.",
  },
  {
    label: "Controller Panel",
    value: "controller-panel",
    description: "Control system and wiring panel requirement.",
  },
  {
    label: "Doors & Sensors",
    value: "doors-sensors",
    description: "Landing doors, cabin doors, and sensing accessories.",
  },
  {
    label: "Machine & Drive",
    value: "machine-drive",
    description: "Drive system, motor, and related hardware.",
  },
  {
    label: "Safety Accessories",
    value: "safety-accessories",
    description: "Emergency devices, alarms, and safety controls.",
  },
  {
    label: "Installation & Commissioning",
    value: "installation-commissioning",
    description: "Site installation, testing, and handover support.",
  },
];

const initialFormState = {
  clientName: "",
  projectType: "Mall",
  numberOfFloors: "",
  liftType: "Passenger",
  requiredComponents: [],
  estimatedCost: "",
};

export default function ElevatorEstimateAdmin() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateRequiredFields([
      { name: "clientName", label: "Client Name", value: formData.clientName },
      { name: "projectType", label: "Project Type", value: formData.projectType },
      {
        name: "numberOfFloors",
        label: "Number of Floors",
        value: formData.numberOfFloors,
        validator: (value) => (Number(value) > 0 ? "" : "Number of Floors must be greater than 0."),
      },
      { name: "liftType", label: "Lift Type", value: formData.liftType },
      {
        name: "requiredComponents",
        label: "Required Components",
        value: formData.requiredComponents,
      },
      {
        name: "estimatedCost",
        label: "Estimated Cost",
        value: formData.estimatedCost,
        validator: (value) => (Number(value) > 0 ? "" : "Estimated Cost must be greater than 0."),
      },
    ]);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await wait();
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ServicePageLayout
      eyebrow="Elevator Admin"
      title="Elevator Estimate Preparation"
      description="Capture the elevator project details and prepare the estimate from one clean admin form."
      backTo="/services/elevator"
      backLabel="Back to Role Selection"
    >
      <section className="service-form-card">
        <div className="service-form-heading">
          <h2>Estimate Details</h2>
          <p>Use this admin view to capture the scope and prepare an estimate.</p>
        </div>

        <form className="service-form" onSubmit={handleSubmit}>
          <div className="service-form-grid two-column">
            <FormInput
              required
              name="clientName"
              label="Client Name"
              value={formData.clientName}
              error={errors.clientName}
              placeholder="Enter client name"
              onChange={(value) => handleFieldChange("clientName", value)}
            />
            <FormInput
              required
              name="projectType"
              label="Project Type"
              type="select"
              value={formData.projectType}
              error={errors.projectType}
              options={[
                { label: "Mall", value: "Mall" },
                { label: "School", value: "School" },
                { label: "Office", value: "Office" },
                { label: "Residential", value: "Residential" },
              ]}
              onChange={(value) => handleFieldChange("projectType", value)}
            />
            <FormInput
              required
              name="numberOfFloors"
              label="Number of Floors"
              type="number"
              min="1"
              value={formData.numberOfFloors}
              error={errors.numberOfFloors}
              placeholder="Enter total floors"
              onChange={(value) => handleFieldChange("numberOfFloors", value)}
            />
            <FormInput
              required
              name="liftType"
              label="Lift Type"
              type="radio"
              value={formData.liftType}
              options={[
                { label: "Passenger", value: "Passenger" },
                { label: "Goods", value: "Goods" },
              ]}
              onChange={(value) => handleFieldChange("liftType", value)}
            />
          </div>

          <FormInput
            required
            name="requiredComponents"
            label="Required Components"
            type="checkbox-group"
            value={formData.requiredComponents}
            error={errors.requiredComponents}
            options={componentOptions}
            onChange={(value) => handleFieldChange("requiredComponents", value)}
          />

          <FormInput
            required
            name="estimatedCost"
            label="Estimated Cost"
            type="number"
            min="1"
            value={formData.estimatedCost}
            error={errors.estimatedCost}
            placeholder="Enter estimated cost"
            onChange={(value) => handleFieldChange("estimatedCost", value)}
          />

          <div className="service-form-actions">
            <Button type="submit" isLoading={isSubmitting} loadingLabel="Generating...">
              Generate Estimate
            </Button>
          </div>
        </form>
      </section>

      <Modal
        isOpen={isModalOpen}
        title="Estimate Generated"
        message="Estimate generated successfully."
        onClose={() => setIsModalOpen(false)}
      />
    </ServicePageLayout>
  );
}
