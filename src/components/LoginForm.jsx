import Button from "./Button";
import FormInput from "./FormInput";

export default function LoginForm({
  formData,
  feedbackMessage,
  feedbackTone = "",
  isLoading,
  onFieldChange,
  onSubmit,
  onSwitchToSignup,
}) {
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="auth-form-fields">
        <FormInput
          required
          name="username"
          label="Username"
          value={formData.username}
          placeholder="Enter username"
          autoComplete="username"
          onChange={(value) => onFieldChange("username", value)}
        />
        <FormInput
          required
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          placeholder="Enter password"
          autoComplete="current-password"
          onChange={(value) => onFieldChange("password", value)}
        />
      </div>

      {feedbackMessage ? (
        <p className={`auth-feedback ${feedbackTone}`.trim()}>{feedbackMessage}</p>
      ) : null}

      <Button type="submit" fullWidth isLoading={isLoading} loadingLabel="Signing in...">
        Login
      </Button>

      <div className="auth-switch-row">
        <span>New user?</span>
        <button type="button" className="auth-switch-button" onClick={onSwitchToSignup}>
          Create Account
        </button>
      </div>
    </form>
  );
}
