import { useState } from "react";
import { api } from "../api/client";
import QueueList from "../components/QueueList";
import { Alert, EmptyState, Field, PageHeader } from "../components/ui";
import { PatientBanner } from "../components/VisitBlocks";
import { useForm } from "../hooks/useForm";
import { useQueue } from "../hooks/useQueue";
import { formatTime } from "../utils/format";
import { vitalsSchema } from "../utils/validation";

export default function Triage() {
  const queue = useQueue("triage");
  const [message, setMessage] = useState("");

  return (
    <>
      <PageHeader title="Triage" description="Record vital signs, then the patient moves to the doctor's queue." />
      <Alert type="success">{message}</Alert>

      <div className="workspace">
        <QueueList
          title="Waiting for triage"
          visits={queue.visits}
          loading={queue.loading}
          error={queue.error}
          selectedId={queue.selectedId}
          onSelect={(id) => {
            queue.select(id);
            setMessage("");
          }}
        />

        {queue.selected ? (
          <VitalsForm
            key={queue.selected.id}
            visit={queue.selected}
            onSaved={(visit) => {
              setMessage(`Vitals saved. ${visit.patient.name} is now waiting for the doctor.`);
              queue.select(null);
              queue.reload();
            }}
          />
        ) : (
          <div className="card">
            <EmptyState title="Select a patient" description="Pick someone from the queue to record their vitals." />
          </div>
        )}
      </div>
    </>
  );
}

function VitalsForm({ visit, onSaved }) {
  const form = useForm({ bloodPressure: "", pulse: "", temperature: "", saturation: "", weight: "", sugar: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    await form.submit(async (data) => {
      const result = await api(`/visits/${visit.id}/vitals`, { method: "PATCH", body: data });
      onSaved(result.visit);
    }, vitalsSchema);
  }

  const input = (name, label, props) => (
    <Field
      label={label}
      name={name}
      value={form.values[name]}
      onChange={form.handleChange}
      error={form.errors[name]}
      {...props}
    />
  );

  return (
    <section className="card">
      <div className="card-header">
        <PatientBanner patient={visit.patient} />
      </div>
      <form className="card-body stack" onSubmit={handleSubmit} noValidate>
        <p className="muted small">
          Checked in at {formatTime(visit.createdAt)} · Reason: {visit.reason || "not given"}
        </p>
        <Alert>{form.formError}</Alert>

        <div className="form-grid">
          {input("bloodPressure", "Blood pressure (mmHg)", { placeholder: "120/80" })}
          {input("pulse", "Pulse (bpm)", { type: "number", placeholder: "72" })}
          {input("temperature", "Temperature (°C)", { type: "number", step: "0.1", placeholder: "36.8" })}
          {input("saturation", "Oxygen saturation (%)", { type: "number", placeholder: "98" })}
          {input("weight", "Weight (kg)", { type: "number", step: "0.1", placeholder: "70" })}
          {input("sugar", "Blood sugar (mg/dL)", { type: "number", placeholder: "Optional" })}
        </div>

        <div>
          <button className="btn btn-primary" disabled={form.submitting}>
            {form.submitting ? "Saving…" : "Save vitals & send to doctor"}
          </button>
        </div>
      </form>
    </section>
  );
}
