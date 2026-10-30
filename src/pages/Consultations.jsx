import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import Icon from "../components/Icon";
import QueueList from "../components/QueueList";
import { Alert, EmptyState, Field, PageHeader } from "../components/ui";
import { LabResultsTable, PatientBanner, VitalsGrid } from "../components/VisitBlocks";
import { COMMON_LAB_TESTS } from "../config/clinic";
import { useForm } from "../hooks/useForm";
import { useQueue } from "../hooks/useQueue";
import { consultationSchema } from "../utils/validation";

const NEXT_STEP_MESSAGES = {
  lab: "was sent to the laboratory",
  pharmacy: "was sent to the pharmacy",
  completed: "has been discharged",
};

export default function Consultations() {
  const queue = useQueue("consultation");
  const [message, setMessage] = useState("");

  return (
    <>
      <PageHeader title="Consultations" description="Examine patients, order lab tests and prescribe medication." />
      <Alert type="success">{message}</Alert>

      <div className="workspace">
        <QueueList
          title="Waiting for doctor"
          visits={queue.visits}
          loading={queue.loading}
          error={queue.error}
          selectedId={queue.selectedId}
          onSelect={(id) => {
            queue.select(id);
            setMessage("");
          }}
          renderTag={(visit) => visit.labTests.length > 0 && <span className="badge badge-lab">Lab results</span>}
          emptyText="Patients appear here after triage."
        />

        {queue.selected ? (
          <ConsultationPanel
            key={queue.selected.id}
            visit={queue.selected}
            onSaved={(visit) => {
              setMessage(`${visit.patient.name} ${NEXT_STEP_MESSAGES[visit.status]}.`);
              queue.select(null);
              queue.reload();
            }}
          />
        ) : (
          <div className="card">
            <EmptyState title="Select a patient" description="Pick someone from the queue to start the consultation." />
          </div>
        )}
      </div>
    </>
  );
}

const emptyRow = () => ({ key: crypto.randomUUID(), drug: "", dosage: "", frequency: "", duration: "" });
const isBlankRow = (row) => !row.drug && !row.dosage && !row.frequency && !row.duration;

function ConsultationPanel({ visit, onSaved }) {
  // When a patient comes back from the lab, start from what the doctor wrote before.
  const form = useForm({
    diagnosis: visit.consultation?.diagnosis ?? "",
    notes: visit.consultation?.notes ?? "",
  });
  const [tests, setTests] = useState([]);
  const [customTest, setCustomTest] = useState("");
  const [rows, setRows] = useState(() =>
    visit.prescriptions.length ? visit.prescriptions.map((p) => ({ ...p, key: p.id })) : [emptyRow()],
  );

  const orderedTests = visit.labTests.map((t) => t.name);
  const testOptions = [...new Set([...COMMON_LAB_TESTS, ...orderedTests, ...tests])];
  const prescriptions = rows.filter((row) => !isBlankRow(row)).map(({ drug, dosage, frequency, duration }) => ({
    drug,
    dosage,
    frequency,
    duration,
  }));

  let action = "Complete visit";
  if (tests.length) action = `Send to laboratory (${tests.length} test${tests.length > 1 ? "s" : ""})`;
  else if (prescriptions.length) action = "Send to pharmacy";

  function toggleTest(name) {
    setTests((prev) => (prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]));
  }

  function addCustomTest() {
    const name = customTest.trim();
    if (name && !tests.includes(name) && !orderedTests.includes(name)) setTests((prev) => [...prev, name]);
    setCustomTest("");
  }

  function updateRow(key, field, value) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await form.submit(async (data) => {
      const result = await api(`/visits/${visit.id}/consultation`, {
        method: "PATCH",
        body: { ...data, labTests: tests, prescriptions },
      });
      onSaved(result.visit);
    }, consultationSchema);
  }

  return (
    <section className="card">
      <div className="card-header">
        <PatientBanner patient={visit.patient}>
          <Link to={`/patients/${visit.patientId}`} className="btn btn-secondary btn-sm">
            History
          </Link>
        </PatientBanner>
      </div>

      <form className="card-body stack" style={{ gap: 24 }} onSubmit={handleSubmit} noValidate>
        <div className="stack" style={{ gap: 10 }}>
          <span className="section-title">Complaint</span>
          <p>{visit.reason || "No reason given at reception."}</p>
        </div>

        <div className="stack" style={{ gap: 10 }}>
          <span className="section-title">Vitals</span>
          <VitalsGrid vitals={visit.vitals} />
        </div>

        {visit.labTests.length > 0 && (
          <div className="stack" style={{ gap: 10 }}>
            <span className="section-title">Lab results</span>
            <LabResultsTable tests={visit.labTests} />
          </div>
        )}

        <hr className="divider" />
        <Alert>{form.formError}</Alert>

        <Field
          label="Diagnosis"
          name="diagnosis"
          placeholder="e.g. Acute upper respiratory tract infection"
          value={form.values.diagnosis}
          onChange={form.handleChange}
          error={form.errors.diagnosis}
        />
        <Field
          as="textarea"
          label="Clinical notes"
          name="notes"
          placeholder="Examination findings, advice, follow-up…"
          value={form.values.notes}
          onChange={form.handleChange}
          error={form.errors.notes}
        />

        <div className="stack" style={{ gap: 10 }}>
          <span className="section-title">Order lab tests</span>
          <div className="checkbox-grid">
            {testOptions.map((name) => {
              const alreadyOrdered = orderedTests.includes(name);
              return (
                <label key={name} className="checkbox">
                  <input
                    type="checkbox"
                    checked={alreadyOrdered || tests.includes(name)}
                    disabled={alreadyOrdered}
                    onChange={() => toggleTest(name)}
                  />
                  {name}
                  {alreadyOrdered && <span className="muted small">(done)</span>}
                </label>
              );
            })}
          </div>
          <div className="row">
            <input
              className="input"
              style={{ flex: 1, minWidth: 180 }}
              placeholder="Other test…"
              value={customTest}
              onChange={(event) => setCustomTest(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addCustomTest();
                }
              }}
            />
            <button type="button" className="btn btn-secondary" onClick={addCustomTest}>
              Add test
            </button>
          </div>
          {form.errors.labTests && <span className="error small">{form.errors.labTests}</span>}
        </div>

        <div className="stack" style={{ gap: 10 }}>
          <span className="section-title">Prescription</span>
          {rows.map((row) => (
            <div className="rx-row" key={row.key}>
              <input
                className="input"
                placeholder="Drug (e.g. Paracetamol)"
                aria-label="Drug"
                value={row.drug}
                onChange={(e) => updateRow(row.key, "drug", e.target.value)}
              />
              <input
                className="input"
                placeholder="500 mg"
                aria-label="Dosage"
                value={row.dosage}
                onChange={(e) => updateRow(row.key, "dosage", e.target.value)}
              />
              <input
                className="input"
                placeholder="3× daily"
                aria-label="Frequency"
                value={row.frequency}
                onChange={(e) => updateRow(row.key, "frequency", e.target.value)}
              />
              <input
                className="input"
                placeholder="5 days"
                aria-label="Duration"
                value={row.duration}
                onChange={(e) => updateRow(row.key, "duration", e.target.value)}
              />
              <button
                type="button"
                className="btn btn-ghost icon-btn"
                aria-label="Remove medication"
                onClick={() => setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== row.key) : [emptyRow()]))}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
          ))}
          {form.errors.prescriptions && (
            <span className="error small">{form.errors.prescriptions} — fill in every column of each medication.</span>
          )}
          <div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setRows((prev) => [...prev, emptyRow()])}>
              <Icon name="plus" size={14} /> Add medication
            </button>
          </div>
        </div>

        <hr className="divider" />
        <div className="spread">
          <p className="muted small">
            {tests.length
              ? "The patient will come back to you once all results are in."
              : prescriptions.length
                ? "The prescription goes to the pharmacy."
                : "No tests or medication: the visit will be closed."}
          </p>
          <button className="btn btn-primary" disabled={form.submitting}>
            {form.submitting ? "Saving…" : action}
          </button>
        </div>
      </form>
    </section>
  );
}
