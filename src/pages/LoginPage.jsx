import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { isValidMobileNumber, validateRequiredFields, wait } from "../utils/formHelpers";

const loginInitialState = {
  username: "",
  password: "",
};

const signupInitialState = {
  fullName: "",
  username: "",
  mobileNumber: "",
  password: "",
  confirmPassword: "",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(loginInitialState);
  const [signupForm, setSignupForm] = useState(signupInitialState);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackTone, setFeedbackTone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("login-page-active");

    return () => {
      document.body.classList.remove("login-page-active");
    };
  }, []);

  const setFeedback = (message, tone) => {
    setFeedbackMessage(message);
    setFeedbackTone(tone);
  };

  const handleLoginFieldChange = (field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
    if (feedbackMessage) {
      setFeedback("", "");
    }
  };

  const handleSignupFieldChange = (field, value) => {
    setSignupForm((current) => ({ ...current, [field]: value }));
    if (feedbackMessage) {
      setFeedback("", "");
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateRequiredFields([
      { name: "username", label: "Username", value: loginForm.username },
      { name: "password", label: "Password", value: loginForm.password },
    ]);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback(Object.values(nextErrors)[0], "is-error");
      return;
    }

    setIsLoading(true);

    try {
      await wait();

      const matchesRegisteredUser = registeredUsers.some(
        (user) =>
          user.username === loginForm.username.trim() &&
          user.password === loginForm.password,
      );
      const isAdminLogin =
        loginForm.username.trim() === "admin" && loginForm.password === "admin123";

      if (isAdminLogin || matchesRegisteredUser) {
        navigate("/home");
        return;
      }

      setFeedback(
        "Invalid username or password. Use admin / admin123 for demo login.",
        "is-error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateRequiredFields([
      { name: "fullName", label: "Full Name", value: signupForm.fullName },
      { name: "username", label: "Username", value: signupForm.username },
      {
        name: "mobileNumber",
        label: "Mobile Number",
        value: signupForm.mobileNumber,
        validator: (value) =>
          isValidMobileNumber(value) ? "" : "Mobile number must be exactly 10 digits.",
      },
      { name: "password", label: "Password", value: signupForm.password },
      { name: "confirmPassword", label: "Confirm Password", value: signupForm.confirmPassword },
    ]);

    const trimmedUsername = signupForm.username.trim().toLowerCase();

    if (
      !nextErrors.confirmPassword &&
      signupForm.password !== signupForm.confirmPassword
    ) {
      nextErrors.confirmPassword = "Password and Confirm Password must match.";
    }

    if (
      !nextErrors.username &&
      (trimmedUsername === "admin" ||
        registeredUsers.some((user) => user.username.toLowerCase() === trimmedUsername))
    ) {
      nextErrors.username = "This username is already in use.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFeedback(Object.values(nextErrors)[0], "is-error");
      return;
    }

    setIsLoading(true);

    try {
      await wait();

      setRegisteredUsers((current) => [
        ...current,
        {
          fullName: signupForm.fullName.trim(),
          username: signupForm.username.trim(),
          mobileNumber: signupForm.mobileNumber.trim(),
          password: signupForm.password,
        },
      ]);
      setLoginForm({
        username: signupForm.username.trim(),
        password: "",
      });
      setSignupForm(signupInitialState);
      setMode("login");
      setFeedback("Account created successfully. Please login to continue.", "is-success");
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignup = () => {
    setMode("signup");
    setFeedback("", "");
  };

  const switchToLogin = () => {
    setMode("login");
    setFeedback("", "");
  };

  return (
    <div className="login-page-shell">
      <div className="login-page-shape login-shape-a" aria-hidden="true" />
      <div className="login-page-shape login-shape-b" aria-hidden="true" />
      <div className="login-page-shape login-shape-c" aria-hidden="true" />

      <div className="login-page-stage">
        <div className="login-page-content">
          <section className="welcome-panel">
            <span className="welcome-badge">Welcome Portal</span>
            <h1>Welcome to Deshmukh Infra &amp; Energy Solutions</h1>
            <p className="welcome-subtitle">
              Solar | Elevator | Road Marking | Tours &amp; Travels
            </p>
            <p className="welcome-copy">
              Sign in to access the company website, role-based service flows, and the
              proposal tools from one clean dashboard.
            </p>

            <div className="welcome-highlights">
              <span>Modern Service Portal</span>
              <span>Fast Estimate Access</span>
              <span>Secure Demo Login</span>
            </div>
          </section>

          <section className="auth-card-shell">
            <div className="auth-card" key={mode}>
              {mode === "login" ? (
                <LoginForm
                  formData={loginForm}
                  feedbackMessage={feedbackMessage}
                  feedbackTone={feedbackTone}
                  isLoading={isLoading}
                  onFieldChange={handleLoginFieldChange}
                  onSubmit={handleLoginSubmit}
                  onSwitchToSignup={switchToSignup}
                />
              ) : (
                <SignupForm
                  formData={signupForm}
                  feedbackMessage={feedbackMessage}
                  feedbackTone={feedbackTone}
                  isLoading={isLoading}
                  onFieldChange={handleSignupFieldChange}
                  onSubmit={handleSignupSubmit}
                  onSwitchToLogin={switchToLogin}
                />
              )}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
