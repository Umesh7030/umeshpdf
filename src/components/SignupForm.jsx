import Button from "./Button";
import FormInput from "./FormInput";

export default function SignupForm({
  formData,
  feedbackMessage,
  feedbackTone = "",
  isLoading,
  onFieldChange,
  onSubmit,
  onSwitchToLogin,
}) {
  return (
    <form className="auth-form signup-form" onSubmit={onSubmit} noValidate>
      <div className="auth-form-copy">
        <p className="eyebrow">Create Account</p>
        <h2>Register New User</h2>
        <p>Create your account to get started with the service portal.</p>
      </div>

      <div className="auth-form-fields signup-grid">
        <div className="field-span-two">
          <FormInput
            required
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            placeholder="Enter full name"
            autoComplete="name"
            onChange={(value) => onFieldChange("fullName", value)}
          />
        </div>
        <FormInput
          required
          name="username"
          label="Username"
          value={formData.username}
          placeholder="Choose username"
          autoComplete="username"
          onChange={(value) => onFieldChange("username", value)}
        />
        <FormInput
          required
          name="mobileNumber"
          label="Mobile Number"
          value={formData.mobileNumber}
          placeholder="10-digit number"
          autoComplete="tel"
          inputMode="numeric"
          maxLength={10}
          onChange={(value) => onFieldChange("mobileNumber", value.replace(/\D/g, ""))}
        />
        <FormInput
          required
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          placeholder="Create password"
          autoComplete="new-password"
          onChange={(value) => onFieldChange("password", value)}
        />
        <FormInput
          required
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          placeholder="Confirm password"
          autoComplete="new-password"
          onChange={(value) => onFieldChange("confirmPassword", value)}
        />
      </div>

      {feedbackMessage ? (
        <p className={`auth-feedback ${feedbackTone}`.trim()}>{feedbackMessage}</p>
      ) : null}

      <Button type="submit" fullWidth isLoading={isLoading} loadingLabel="Registering...">
        Register
      </Button>

      <div className="auth-switch-row">
        <span>Already have an account?</span>
        <button type="button" className="auth-switch-button" onClick={onSwitchToLogin}>
          Login
        </button>
      </div>
    </form>
  );
}
