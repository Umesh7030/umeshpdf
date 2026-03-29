import { useState } from "react";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import Modal from "../components/Modal";
import ServicePageLayout from "../components/ServicePageLayout";
import {
  isValidMobileNumber,
  SUCCESS_MESSAGE,
  validateRequiredFields,
  wait,
} from "../utils/formHelpers";

const initialFormState = {
  name: "",
  mobileNumber: "",
  address: "",
  purpose: "Mall",
};

export default function ElevatorCustomerForm() {
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
      { name: "name", label: "Name", value: formData.name },
      {
        name: "mobileNumber",
        label: "Mobile Number",
        value: formData.mobileNumber,
        validator: (value) =>
          isValidMobileNumber(value) ? "" : "Mobile number must be exactly 10 digits.",
      },
      { name: "address", label: "Address", value: formData.address },
      { name: "purpose", label: "Purpose", value: formData.purpose },
    ]);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await wait();
      setIsModalOpen(true);
      setFormData(initialFormState);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ServicePageLayout
      eyebrow="Elevator Customer"
      title="Elevator Requirement Form"
      description="Share the site details and our team will coordinate the right elevator solution."
      backTo="/services/elevator"
      backLabel="Back to Role Selection"
    >
      <section className="service-form-card">
        <div className="service-form-heading">
          <h2>Customer Details</h2>
          <p>Fill in the project basics and we will get back to you shortly.</p>
        </div>

        <form className="service-form" onSubmit={handleSubmit}>
          <div className="service-form-grid two-column">
            <FormInput
              required
              name="name"
              label="Name"
              value={formData.name}
              error={errors.name}
              placeholder="Enter name"
              onChange={(value) => handleFieldChange("name", value)}
            />
            <FormInput
              required
              name="mobileNumber"
              label="Mobile Number"
              value={formData.mobileNumber}
              error={errors.mobileNumber}
              placeholder="Enter 10-digit mobile number"
              inputMode="numeric"
              maxLength={10}
              onChange={(value) => handleFieldChange("mobileNumber", value.replace(/\D/g, ""))}
            />
            <FormInput
              required
              name="purpose"
              label="Purpose"
              type="select"
              value={formData.purpose}
              error={errors.purpose}
              options={[
                { label: "Mall", value: "Mall" },
                { label: "School", value: "School" },
                { label: "Office", value: "Office" },
                { label: "Residential", value: "Residential" },
              ]}
              onChange={(value) => handleFieldChange("purpose", value)}
            />
          </div>

          <FormInput
            required
            name="address"
            label="Address"
            type="textarea"
            rows={4}
            value={formData.address}
            error={errors.address}
            placeholder="Enter full address"
            onChange={(value) => handleFieldChange("address", value)}
          />

          <div className="service-form-actions">
            <Button type="submit" isLoading={isSubmitting} loadingLabel="Submitting...">
              Submit
            </Button>
          </div>
        </form>
      </section>

      <Modal
        isOpen={isModalOpen}
        title="Request Submitted"
        message={SUCCESS_MESSAGE}
        onClose={() => setIsModalOpen(false)}
      />
    </ServicePageLayout>
  );
}
