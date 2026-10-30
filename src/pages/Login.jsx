import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Icon from "../components/Icon";
import { Alert, Field } from "../components/ui";
import { canVisit, homeFor, ROLE_LABELS } from "../config/roles";
import { useForm } from "../hooks/useForm";
import { loginSchema } from "../utils/validation";

// Matches the accounts created by the server's seed script.
const DEMO_ACCOUNTS = [
  { role: "admin", email: "admin@clinic.com", password: "admin123" },
  { role: "reception", email: "reception@clinic.com", password: "reception123" },
  { role: "nurse", email: "nurse@clinic.com", password: "nurse123" },
  { role: "doctor", email: "doctor@clinic.com", password: "doctor123" },
  { role: "lab", email: "lab@clinic.com", password: "lab123" },
  { role: "pharmacy", email: "pharmacy@clinic.com", password: "pharmacy123" },
];

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const form = useForm({ email: "", password: "" });

  // Once logged in, go back to the page that sent us here (or the role's home page).
  if (user) {
    const from = location.state?.from?.pathname;
    return <Navigate to={from && canVisit(user.role, from) ? from : homeFor(user.role)} replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    form.submit(({ email, password }) => login(email, password), loginSchema);
  }

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="cross" size={16} fill="currentColor" stroke="none" />
          </span>
          Jibreel Clinic
        </div>
        <div>
          <h2>Every patient, from the front desk to the pharmacy.</h2>
          <div className="auth-steps">
            <span>Reception</span>
            <span>Triage</span>
            <span>Doctor</span>
            <span>Laboratory</span>
            <span>Pharmacy</span>
          </div>
        </div>
        <p className="small">Staff access only.</p>
      </aside>

      <main className="auth-main">
        <div className="auth-card stack" style={{ gap: 24 }}>
          <div>
            <h1>Sign in</h1>
            <p className="muted">Use your staff email and password.</p>
          </div>

          <form className="stack" onSubmit={handleSubmit} noValidate>
            <Alert>{form.formError}</Alert>
            <Field
              label="Email"
              type="email"
              name="email"
              autoComplete="username"
              value={form.values.email}
              onChange={form.handleChange}
              error={form.errors.email}
              autoFocus
            />
            <Field
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={form.values.password}
              onChange={form.handleChange}
              error={form.errors.password}
            />
            <button className="btn btn-primary btn-block" disabled={form.submitting}>
              {form.submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="stack" style={{ gap: 8 }}>
            <span className="section-title">Demo accounts</span>
            <div className="demo-accounts">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => form.setValues({ email: account.email, password: account.password })}
                >
                  {ROLE_LABELS[account.role]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
