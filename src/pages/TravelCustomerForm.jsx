import { useState } from "react";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import Modal from "../components/Modal";
import ServicePageLayout from "../components/ServicePageLayout";
import {
  getVehicleSuggestion,
  SUCCESS_MESSAGE,
  validateRequiredFields,
  wait,
} from "../utils/formHelpers";

const initialFormState = {
  pickupLocation: "",
  destination: "",
  travelDate: "",
  numberOfDays: "",
  numberOfMembers: "",
};

export default function TravelCustomerForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const suggestedVehicle = getVehicleSuggestion(formData.numberOfMembers);

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateRequiredFields([
      { name: "pickupLocation", label: "Pickup Location", value: formData.pickupLocation },
      { name: "destination", label: "Destination", value: formData.destination },
      { name: "travelDate", label: "Travel Date", value: formData.travelDate },
      {
        name: "numberOfDays",
        label: "Number of Days",
        value: formData.numberOfDays,
        validator: (value) => (Number(value) > 0 ? "" : "Number of Days must be greater than 0."),
      },
      {
        name: "numberOfMembers",
        label: "Number of Members",
        value: formData.numberOfMembers,
        validator: (value) =>
          Number(value) > 0 ? "" : "Number of Members must be greater than 0.",
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
      setFormData(initialFormState);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ServicePageLayout
      eyebrow="Travel Customer"
      title="Travel Request Form"
      description="Share your trip details and we will coordinate the right vehicle and travel support."
      backTo="/services/travel"
      backLabel="Back to Role Selection"
    >
      <section className="service-form-card">
        <div className="service-form-heading">
          <h2>Travel Details</h2>
          <p>Fill in the trip plan and review the suggested vehicle instantly.</p>
        </div>

        <form className="service-form" onSubmit={handleSubmit}>
          <div className="service-form-grid two-column">
            <FormInput
              required
              name="pickupLocation"
              label="Pickup Location"
              value={formData.pickupLocation}
              error={errors.pickupLocation}
              placeholder="Enter pickup location"
              onChange={(value) => handleFieldChange("pickupLocation", value)}
            />
            <FormInput
              required
              name="destination"
              label="Destination"
              value={formData.destination}
              error={errors.destination}
              placeholder="Enter destination"
              onChange={(value) => handleFieldChange("destination", value)}
            />
            <FormInput
              required
              name="travelDate"
              label="Travel Date"
              type="date"
              value={formData.travelDate}
              error={errors.travelDate}
              onChange={(value) => handleFieldChange("travelDate", value)}
            />
            <FormInput
              required
              name="numberOfDays"
              label="Number of Days"
              type="number"
              min="1"
              value={formData.numberOfDays}
              error={errors.numberOfDays}
              placeholder="Enter number of days"
              onChange={(value) => handleFieldChange("numberOfDays", value)}
            />
            <FormInput
              required
              name="numberOfMembers"
              label="Number of Members"
              type="number"
              min="1"
              value={formData.numberOfMembers}
              error={errors.numberOfMembers}
              placeholder="Enter number of members"
              onChange={(value) => handleFieldChange("numberOfMembers", value)}
            />
          </div>

          <div className="vehicle-suggestion-card">
            <span>Suggested Vehicle</span>
            <strong>{suggestedVehicle || "Enter members to see the best fit"}</strong>
            <p>
              Capacity guide: 1-4 members for Car, 5-9 for SUV, 10-15 for Tempo Traveller.
            </p>
          </div>

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
