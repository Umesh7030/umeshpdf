const variantClassNames = {
  primary: "primary-button",
  secondary: "secondary-button",
  ghost: "ghost-button",
};

export default function Button({
  children,
  className = "",
  disabled = false,
  fullWidth = false,
  isLoading = false,
  loadingLabel = "Please wait...",
  type = "button",
  variant = "primary",
  ...props
}) {
  const buttonClassName = [
    variantClassNames[variant] ?? variantClassNames.primary,
    "app-button",
    fullWidth ? "button-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={buttonClassName} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span className="button-loading-content">
          <span className="button-spinner" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
