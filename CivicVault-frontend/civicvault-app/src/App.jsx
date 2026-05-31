import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="social-icon">
      <path
        fill="#ffffff"
        d="M21.35 11.1H12v2.95h5.35c-.23 1.4-1.5 4.1-5.35 4.1A6.2 6.2 0 1 1 12 5.8c1.77 0 2.96.76 3.64 1.42l2.48-2.39A9.98 9.98 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.63-4.08 9.63-9.83 0-.66-.07-1.16-.28-1.69Z"
      />
      <path fill="#ffffff" d="M3.54 7.36 6.4 9.45A6.2 6.2 0 0 1 12 5.8c1.77 0 2.96.76 3.64 1.42l2.48-2.39A9.98 9.98 0 0 0 12 2a9.97 9.97 0 0 0-8.46 5.36Z" />
      <path fill="#ffffff" d="M12 22c2.7 0 4.97-.89 6.63-2.43l-3.06-2.5c-.84.57-1.95.97-3.57.97a6.2 6.2 0 0 1-5.36-4.1L3.76 16.1A10 10 0 0 0 12 22Z" />
      <path fill="#ffffff" d="M5.64 13.94A6.2 6.2 0 0 1 5.44 12c0-.67.1-1.32.28-1.94l-2.18-1.7A9.96 9.96 0 0 0 2 12c0 1.59.38 3.1 1.06 4.43l2.58-2.49Z" />
    </svg>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    governmentId: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: true,
  });
  const [status, setStatus] = useState(null);

  const isSignIn = mode === "signin";
  const isUserRole = role === "user";

  const updateField = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!isSignIn && formState.password !== formState.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setStatus({
      type: "success",
      message: isSignIn
        ? `Signing you in as ${isUserRole ? "a user" : "a government body"}.`
        : `Creating a ${isUserRole ? "user" : "government body"} account.`,
    });

    setTimeout(() => {
      navigate("/vault");
    }, 1000);
  };

  return (
    <main className="auth-container">
      <section className="auth-card">
        <div className="auth-header">
          <div className="brand-logo">
            <div className="logo-icon">CV</div>
            <div className="brand-text">
              <h1>CivicVault</h1>
              <p>Secure Document Management</p>
            </div>
          </div>
        </div>

        <div className="auth-tabs">
          <div className="role-tabs">
            <button
              className={`tab-btn ${isUserRole ? "active" : ""}`}
              onClick={() => setRole("user")}
            >
              User
            </button>
            <button
              className={`tab-btn ${!isUserRole ? "active" : ""}`}
              onClick={() => setRole("government")}
            >
              Government
            </button>
          </div>

          <div className="mode-tabs">
            <button
              className={`tab-btn ${isSignIn ? "active" : ""}`}
              onClick={() => setMode("signin")}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${!isSignIn ? "active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="auth-content">
          <h2>
            {isSignIn
              ? isUserRole
                ? "User Sign In"
                : "Government Sign In"
              : isUserRole
                ? "Create User Account"
                : "Create Government Account"}
          </h2>
          <p>
            {isSignIn
              ? isUserRole
                ? "Access your secure document vault"
                : "Access government document portal"
              : isUserRole
                ? "Register to manage your documents securely"
                : "Register to access government documents"}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isSignIn && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                autoComplete="name"
                placeholder={isUserRole ? "John Doe" : "Government Officer"}
                value={formState.name}
                onChange={event => updateField("name", event.target.value)}
                required
              />
            </div>
          )}

          {!isUserRole && (
            <div className="form-group">
              <label>Government ID No.</label>
              <input
                type="text"
                autoComplete="off"
                inputMode="numeric"
                placeholder="Enter government ID number"
                value={formState.governmentId}
                onChange={event => updateField("governmentId", event.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
              value={formState.email}
              onChange={event => updateField("email", event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete={isSignIn ? "current-password" : "new-password"}
                placeholder="Enter password"
                value={formState.password}
                onChange={event => updateField("password", event.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {!isSignIn && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm password"
                value={formState.confirmPassword}
                onChange={event => updateField("confirmPassword", event.target.value)}
                required
              />
            </div>
          )}

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formState.rememberMe}
                onChange={event => updateField("rememberMe", event.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <button type="button" className="link-btn">
              Forgot password?
            </button>
          </div>

          {status && (
            <div className={`status-message ${status.type === "error" ? "error" : "success"}`}>
              {status.message}
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isSignIn ? "Sign In" : "Create Account"}
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-btn google-btn">
              <GoogleIcon />
              <span>Google</span>
            </button>
          </div>
        </form>

        <p className="auth-footer">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="link-btn"
            onClick={() => setMode(isSignIn ? "signup" : "signin")}
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </section>
    </main>
  );
}