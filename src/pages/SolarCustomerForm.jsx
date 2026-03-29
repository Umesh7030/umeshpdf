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
  customerName: "",
  mobileNumber: "",
  address: "",
  purpose: "Residential",
  monthlyElectricityBill: "",
  knowsCapacity: "No",
  capacity: "",
};

export default function SolarCustomerForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
      ...(field === "knowsCapacity" && value === "No" ? { capacity: "" } : {}),
    }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateRequiredFields([
      { name: "customerName", label: "Customer Name", value: formData.customerName },
      {
        name: "mobileNumber",
        label: "Mobile Number",
        value: formData.mobileNumber,
        validator: (value) =>
          isValidMobileNumber(value) ? "" : "Mobile number must be exactly 10 digits.",
      },
      { name: "address", label: "Address", value: formData.address },
      { name: "purpose", label: "Purpose", value: formData.purpose },
      {
        name: "monthlyElectricityBill",
        label: "Monthly Electricity Bill",
        value: formData.monthlyElectricityBill,
        validator: (value) =>
          Number(value) > 0 ? "" : "Monthly Electricity Bill must be greater than 0.",
      },
      ...(formData.knowsCapacity === "Yes"
        ? [
            {
              name: "capacity",
              label: "Solar Capacity",
              value: formData.capacity,
              validator: (value) =>
                Number(value) > 0 ? "" : "Solar Capacity must be greater than 0.",
            },
          ]
        : []),
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
      eyebrow="Solar Customer"
      title="Solar Requirement Form"
      description="Tell us a little about your solar requirement and we will contact you with the next steps."
      backTo="/services/solar"
      backLabel="Back to Role Selection"
    >
      <section className="service-form-card">
        <div className="service-form-heading">
          <h2>Customer Details</h2>
          <p>All fields marked with * are required.</p>
        </div>

        <form className="service-form" onSubmit={handleSubmit}>
          <div className="service-form-grid two-column">
            <FormInput
              required
              name="customerName"
              label="Customer Name"
              value={formData.customerName}
              error={errors.customerName}
              placeholder="Enter customer name"
              onChange={(value) => handleFieldChange("customerName", value)}
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
                { label: "Residential", value: "Residential" },
                { label: "Business", value: "Business" },
                { label: "School", value: "School" },
                { label: "Office", value: "Office" },
              ]}
              onChange={(value) => handleFieldChange("purpose", value)}
            />
            <FormInput
              required
              name="monthlyElectricityBill"
              label="Monthly Electricity Bill"
              type="number"
              min="1"
              value={formData.monthlyElectricityBill}
              error={errors.monthlyElectricityBill}
              placeholder="Enter bill amount"
              onChange={(value) => handleFieldChange("monthlyElectricityBill", value)}
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

          <FormInput
            required
            name="knowsCapacity"
            label="Do you know required solar capacity?"
            type="radio"
            value={formData.knowsCapacity}
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            onChange={(value) => handleFieldChange("knowsCapacity", value)}
          />

          {formData.knowsCapacity === "Yes" ? (
            <FormInput
              required
              name="capacity"
              label="Required Capacity (kW)"
              type="number"
              min="0.1"
              step="0.1"
              value={formData.capacity}
              error={errors.capacity}
              placeholder="Enter capacity in kW"
              onChange={(value) => handleFieldChange("capacity", value)}
            />
          ) : null}

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
