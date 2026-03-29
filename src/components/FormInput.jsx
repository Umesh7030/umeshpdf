export default function FormInput({
  error,
  helperText,
  id,
  label,
  name,
  onChange,
  options = [],
  required = false,
  rows = 4,
  type = "text",
  value,
  ...props
}) {
  const fieldId = id ?? name;
  const describedBy = error ? `${fieldId}-error` : helperText ? `${fieldId}-help` : undefined;

  const commonProps = {
    id: fieldId,
    name,
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(error),
    required,
    ...props,
  };

  let control = null;

  if (type === "textarea") {
    control = (
      <textarea
        {...commonProps}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  } else if (type === "select") {
    control = (
      <select {...commonProps} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (type === "radio") {
    control = (
      <div className="field-options" role="radiogroup" aria-invalid={Boolean(error)}>
        {options.map((option) => {
          const optionId = `${fieldId}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={`field-option ${value === option.value ? "is-selected" : ""}`.trim()}
            >
              <input
                id={optionId}
                className="field-option-input"
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(event) => onChange(event.target.value)}
              />
              <div className="field-option-copy">
                <strong>{option.label}</strong>
                {option.description ? <small>{option.description}</small> : null}
              </div>
            </label>
          );
        })}
      </div>
    );
  } else if (type === "checkbox-group") {
    control = (
      <div className="field-options checkbox-group">
        {options.map((option) => {
          const optionId = `${fieldId}-${option.value}`;
          const isChecked = value.includes(option.value);

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={`field-option ${isChecked ? "is-selected" : ""}`.trim()}
            >
              <input
                id={optionId}
                className="field-option-input"
                type="checkbox"
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={(event) => {
                  const nextValue = event.target.checked
                    ? [...value, option.value]
                    : value.filter((item) => item !== option.value);

                  onChange(nextValue);
                }}
              />
              <div className="field-option-copy">
                <strong>{option.label}</strong>
                {option.description ? <small>{option.description}</small> : null}
              </div>
            </label>
          );
        })}
      </div>
    );
  } else {
    control = (
      <input
        {...commonProps}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <label className="field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {control}
      {helperText ? (
        <small className="field-help" id={`${fieldId}-help`}>
          {helperText}
        </small>
      ) : null}
      {error ? (
        <small className="field-error" id={`${fieldId}-error`}>
          {error}
        </small>
      ) : null}
    </label>
  );
}
