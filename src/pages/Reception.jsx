import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { Alert, AsyncContent, EmptyState, Field, PageHeader, SearchInput, StatusBadge } from "../components/ui";
import { DEFAULT_VISIT_FEE } from "../config/clinic";
import { useApi } from "../hooks/useApi";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useForm } from "../hooks/useForm";
import { capitalize, formatMoney, formatPhone, formatTime, initials } from "../utils/format";
import { patientSchema, visitSchema } from "../utils/validation";

const EMPTY_PATIENT = { name: "", phone: "", gender: "", age: "" };

export default function Reception() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState("");
  const activeVisits = useApi("/visits?active=true");

  function handleRegistered(patient) {
    setSelectedPatient(patient);
    setMessage(`${patient.name} registered. Take payment to start the visit.`);
  }

  function handleVisitStarted(visit) {
    setSelectedPatient(null);
    setMessage(`${visit.patient.name} paid and was sent to triage.`);
    activeVisits.reload();
  }

  return (
    <>
      <PageHeader title="Reception" description="Register patients, take payment and send them to triage." />
      <Alert type="success">{message}</Alert>

      <div className="grid-2">
        <RegisterPatientCard onRegistered={handleRegistered} />
        <StartVisitCard
          selected={selectedPatient}
          onSelect={(patient) => {
            setSelectedPatient(patient);
            setMessage("");
          }}
          onStarted={handleVisitStarted}
        />
      </div>

      <section className="card">
        <div className="card-header">
          <div>
            <h2>In the clinic now</h2>
            <p className="muted small">Patients with an open visit and where they are.</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={activeVisits.reload}>
            Refresh
          </button>
        </div>
        <AsyncContent loading={activeVisits.loading && !activeVisits.data} error={activeVisits.error}>
          {activeVisits.data?.visits.length ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Reason</th>
                    <th>Arrived</th>
                    <th>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {activeVisits.data.visits.map((visit) => (
                    <tr key={visit.id}>
                      <td>
                        <Link to={`/patients/${visit.patientId}`}>{visit.patient?.name}</Link>
                      </td>
                      <td className="muted">{visit.reason || "—"}</td>
                      <td className="num">{formatTime(visit.createdAt)}</td>
                      <td>
                        <StatusBadge status={visit.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No open visits" description="Patients you check in will appear here." />
          )}
        </AsyncContent>
      </section>
    </>
  );
}

function RegisterPatientCard({ onRegistered }) {
  const form = useForm(EMPTY_PATIENT);

  async function handleSubmit(event) {
    event.preventDefault();
    await form.submit(async (data) => {
      const { patient } = await api("/patients", { method: "POST", body: data });
      form.reset();
      onRegistered(patient);
    }, patientSchema);
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>New patient</h2>
      </div>
      <form className="card-body stack" onSubmit={handleSubmit} noValidate>
        <Alert>{form.formError}</Alert>
        <div className="form-grid">
          <Field
            className="full"
            label="Full name"
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
            error={form.errors.name}
          />
          <Field
            className="full"
            label="Phone number"
            name="phone"
            type="tel"
            placeholder="079 123 4567"
            value={form.values.phone}
            onChange={form.handleChange}
            error={form.errors.phone}
          />
          <Field
            as="select"
            label="Gender"
            name="gender"
            value={form.values.gender}
            onChange={form.handleChange}
            error={form.errors.gender}
          >
            <option value="">Select…</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </Field>
          <Field
            label="Age"
            name="age"
            type="number"
            min="0"
            value={form.values.age}
            onChange={form.handleChange}
            error={form.errors.age}
          />
        </div>
        <div>
          <button className="btn btn-primary" disabled={form.submitting}>
            {form.submitting ? "Saving…" : "Register patient"}
          </button>
        </div>
      </form>
    </section>
  );
}

function StartVisitCard({ selected, onSelect, onStarted }) {
  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search.trim());
  const results = useApi(query.length >= 2 ? `/patients?search=${encodeURIComponent(query)}` : null);

  return (
    <section className="card">
      <div className="card-header">
        <h2>Check in &amp; payment</h2>
      </div>
      <div className="card-body stack">
        {selected ? (
          <CheckInForm key={selected.id} patient={selected} onCancel={() => onSelect(null)} onStarted={onStarted} />
        ) : (
          <>
            <SearchInput
              placeholder="Search by name or phone number"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search patients"
            />
            {query.length < 2 ? (
              <p className="muted small">Type at least 2 characters to search existing patients.</p>
            ) : (
              <AsyncContent loading={results.loading && !results.data} error={results.error}>
                {results.data?.patients.length ? (
                  <div className="queue" style={{ padding: 0 }}>
                    {results.data.patients.map((patient) => (
                      <button key={patient.id} type="button" className="queue-item" onClick={() => onSelect(patient)}>
                        <div className="spread">
                          <span className="name">{patient.name}</span>
                          <span className="muted small num">{formatPhone(patient.phone)}</span>
                        </div>
                        <span className="muted small">
                          {capitalize(patient.gender)} · {patient.age} yrs
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No patients found" description="Register them with the form on the left." />
                )}
              </AsyncContent>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function CheckInForm({ patient, onCancel, onStarted }) {
  const form = useForm({ reason: "", fee: String(DEFAULT_VISIT_FEE) });

  async function handleSubmit(event) {
    event.preventDefault();
    await form.submit(async (data) => {
      const { visit } = await api("/visits", { method: "POST", body: { ...data, patientId: patient.id } });
      onStarted(visit);
    }, visitSchema);
  }

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      <div className="spread">
        <div className="patient-banner">
          <span className="avatar">{initials(patient.name)}</span>
          <div>
            <h3>{patient.name}</h3>
            <p className="muted small">
              {capitalize(patient.gender)} · {patient.age} yrs · {formatPhone(patient.phone)}
            </p>
          </div>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          Change
        </button>
      </div>

      <Alert>{form.formError}</Alert>
      <Field
        label="Reason for visit"
        name="reason"
        placeholder="e.g. Fever and headache"
        value={form.values.reason}
        onChange={form.handleChange}
        error={form.errors.reason}
      />
      <Field
        label="Consultation fee"
        name="fee"
        type="number"
        min="0"
        step="0.5"
        value={form.values.fee}
        onChange={form.handleChange}
        error={form.errors.fee}
      />
      <button className="btn btn-primary" disabled={form.submitting}>
        {form.submitting ? "Saving…" : `Take payment ${formatMoney(Number(form.values.fee) || 0)} & send to triage`}
      </button>
    </form>
  );
}
