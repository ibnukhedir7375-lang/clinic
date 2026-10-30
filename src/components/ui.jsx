import { useId } from "react";
import { VISIT_STATUS_LABELS } from "../config/clinic";
import Icon from "./Icon";

export function PageHeader({ title, description, children }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="row">{children}</div>}
    </header>
  );
}

// Label + input + error message. Pass `as="select"` or `as="textarea"` for other controls.
export function Field({ label, error, hint, as: Control = "input", className = "", children, ...props }) {
  const id = useId();
  const controlClass = { input: "input", select: "select", textarea: "textarea" }[Control];
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <Control id={id} className={controlClass} aria-invalid={Boolean(error)} {...props}>
        {children}
      </Control>
      {error ? <span className="error">{error}</span> : hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export function SearchInput(props) {
  return (
    <div className="search">
      <Icon name="search" size={16} />
      <input type="search" className="input" {...props} />
    </div>
  );
}

export function Alert({ type = "error", children }) {
  if (!children) return null;
  return (
    <div className={`alert alert-${type}`} role={type === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="loading">
      <div className="spinner" role="status" aria-label="Loading" />
    </div>
  );
}

export function EmptyState({ title, description, children }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {description && <p className="small">{description}</p>}
      {children}
    </div>
  );
}

export function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{VISIT_STATUS_LABELS[status] ?? status}</span>;
}

// Shows a spinner, an error, or the children once data has loaded.
export function AsyncContent({ loading, error, children }) {
  if (error) return <div className="card-body"><Alert>{error.message}</Alert></div>;
  if (loading) return <Spinner />;
  return children;
}
