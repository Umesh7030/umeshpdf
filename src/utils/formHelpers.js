export const SUCCESS_MESSAGE =
  "Request submitted successfully. Our team will reach out to you shortly.";

export const wait = (duration = 900) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

export const isBlank = (value) =>
  value == null || (typeof value === "string" && value.trim() === "") || value === "";

export const isValidMobileNumber = (value) => /^\d{10}$/.test(String(value).trim());

export const validateRequiredFields = (fields) =>
  fields.reduce((errors, field) => {
    const isEmpty = Array.isArray(field.value) ? field.value.length === 0 : isBlank(field.value);

    if (isEmpty) {
      errors[field.name] = `${field.label} is required.`;
      return errors;
    }

    if (field.validator) {
      const validationMessage = field.validator(field.value);

      if (validationMessage) {
        errors[field.name] = validationMessage;
      }
    }

    return errors;
  }, {});

export const getVehicleSuggestion = (members) => {
  const memberCount = Number(members);

  if (!Number.isFinite(memberCount) || memberCount < 1) {
    return "";
  }

  if (memberCount <= 4) {
    return "Car";
  }

  if (memberCount <= 9) {
    return "SUV";
  }

  if (memberCount <= 15) {
    return "Tempo Traveller";
  }

  return "Custom travel arrangement";
};
