import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/useAuth";
import Icon from "../components/Icon";
import { Alert, AsyncContent, Field, PageHeader } from "../components/ui";
import { ROLE_LABELS } from "../config/roles";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { formatDate, initials } from "../utils/format";
import { staffSchema } from "../utils/validation";

export default function Staff() {
  const { user: me } = useAuth();
  const { data, loading, error, reload } = useApi("/users");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: "success", text: "" });

  // Runs a change against the API and shows the outcome at the top of the page.
  async function run(action, successText) {
    try {
      await action();
      setMessage({ type: "success", text: successText });
      reload();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  const changeRole = (user, role) =>
    run(
      () => api(`/users/${user.id}`, { method: "PATCH", body: { role } }),
      `${user.name} is now ${ROLE_LABELS[role]}.`,
    );

  const toggleActive = (user) =>
    run(
      () => api(`/users/${user.id}`, { method: "PATCH", body: { active: !user.active } }),
      `${user.name} was ${user.active ? "disabled" : "enabled"}.`,
    );

  const remove = (user) => {
    if (!window.confirm(`Delete ${user.name}'s account? This can't be undone.`)) return;
    run(() => api(`/users/${user.id}`, { method: "DELETE" }), `${user.name} was deleted.`);
  };

  return (
    <>
      <PageHeader title="Staff" description="Manage who can sign in and what they can do.">
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Icon name="plus" size={16} /> Add staff member
          </button>
        )}
      </PageHeader>

      <Alert type={message.type}>{message.text}</Alert>

      {showForm && (
        <NewStaffForm
          onCancel={() => setShowForm(false)}
          onCreated={(user) => {
            setShowForm(false);
            setMessage({ type: "success", text: `${user.name} can now sign in as ${ROLE_LABELS[user.role]}.` });
            reload();
          }}
        />
      )}

      <section className="card">
        <AsyncContent loading={loading && !data} error={error}>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {data?.users.map((user) => {
                  const isMe = user.id === me.id;
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="row" style={{ flexWrap: "nowrap" }}>
                          <span className="avatar">{initials(user.name)}</span>
                          <div>
                            <div style={{ fontWeight: 600 }}>
                              {user.name} {isMe && <span className="muted small">(you)</span>}
                            </div>
                            <div className="muted small">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <select
                          className="select input-sm"
                          style={{ width: "auto" }}
                          value={user.role}
                          disabled={isMe}
                          onChange={(event) => changeRole(user, event.target.value)}
                          aria-label={`Role for ${user.name}`}
                        >
                          {Object.entries(ROLE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className={`badge ${user.active ? "badge-completed" : "badge-inactive"}`}>
                          {user.active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="muted">{formatDate(user.createdAt)}</td>
                      <td>
                        {!isMe && (
                          <div className="row" style={{ justifyContent: "flex-end", flexWrap: "nowrap" }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(user)}>
                              {user.active ? "Disable" : "Enable"}
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => remove(user)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AsyncContent>
      </section>
    </>
  );
}

function NewStaffForm({ onCancel, onCreated }) {
  const form = useForm({ name: "", email: "", password: "", role: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    await form.submit(async (data) => {
      const { user } = await api("/users", { method: "POST", body: data });
      onCreated(user);
    }, staffSchema);
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>New staff member</h2>
        <button type="button" className="btn btn-ghost icon-btn" onClick={onCancel} aria-label="Close">
          <Icon name="x" size={16} />
        </button>
      </div>
      <form className="card-body stack" onSubmit={handleSubmit} noValidate>
        <Alert>{form.formError}</Alert>
        <div className="form-grid">
          <Field label="Full name" name="name" value={form.values.name} onChange={form.handleChange} error={form.errors.name} />
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="off"
            value={form.values.email}
            onChange={form.handleChange}
            error={form.errors.email}
          />
          <Field
            label="Temporary password"
            name="password"
            type="password"
            autoComplete="new-password"
            hint="At least 6 characters. Share it with them privately."
            value={form.values.password}
            onChange={form.handleChange}
            error={form.errors.password}
          />
          <Field as="select" label="Role" name="role" value={form.values.role} onChange={form.handleChange} error={form.errors.role}>
            <option value="">Select a role…</option>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Field>
        </div>
        <div className="row">
          <button className="btn btn-primary" disabled={form.submitting}>
            {form.submitting ? "Creating…" : "Create account"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
