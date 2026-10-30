import { useState } from "react";
import { api } from "../api/client";
import QueueList from "../components/QueueList";
import { Alert, EmptyState, PageHeader } from "../components/ui";
import { PatientBanner, PrescriptionTable } from "../components/VisitBlocks";
import { useQueue } from "../hooks/useQueue";

export default function Pharmacy() {
  const queue = useQueue("pharmacy");
  const [message, setMessage] = useState("");

  return (
    <>
      <PageHeader title="Pharmacy" description="Hand out prescribed medication and close the visit." />
      <Alert type="success">{message}</Alert>

      <div className="workspace">
        <QueueList
          title="Prescriptions waiting"
          visits={queue.visits}
          loading={queue.loading}
          error={queue.error}
          selectedId={queue.selectedId}
          onSelect={(id) => {
            queue.select(id);
            setMessage("");
          }}
          renderTag={(visit) => (
            <span className="badge badge-pharmacy">
              {visit.prescriptions.length} item{visit.prescriptions.length === 1 ? "" : "s"}
            </span>
          )}
          emptyText="Prescriptions from doctors appear here."
        />

        {queue.selected ? (
          <DispensePanel
            key={queue.selected.id}
            visit={queue.selected}
            onDone={(visit) => {
              setMessage(`Medication dispensed to ${visit.patient.name}. Visit completed.`);
              queue.select(null);
              queue.reload();
            }}
          />
        ) : (
          <div className="card">
            <EmptyState title="Select a patient" description="Pick someone from the queue to see their prescription." />
          </div>
        )}
      </div>
    </>
  );
}

function DispensePanel({ visit, onDone }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleDispense() {
    setSaving(true);
    setError("");
    try {
      const result = await api(`/visits/${visit.id}/dispense`, { method: "PATCH" });
      onDone(result.visit);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <PatientBanner patient={visit.patient} />
      </div>
      <div className="card-body stack" style={{ gap: 20 }}>
        <div className="stack" style={{ gap: 6 }}>
          <span className="section-title">Prescribed by</span>
          <p>{visit.consultation?.doctor?.name}</p>
          <p className="muted small">Diagnosis: {visit.consultation?.diagnosis}</p>
        </div>

        <div className="stack" style={{ gap: 8 }}>
          <span className="section-title">Medication</span>
          <PrescriptionTable prescriptions={visit.prescriptions} />
        </div>

        <Alert>{error}</Alert>
        <div>
          <button className="btn btn-primary" onClick={handleDispense} disabled={saving}>
            {saving ? "Saving…" : "Mark as dispensed"}
          </button>
        </div>
      </div>
    </section>
  );
}
