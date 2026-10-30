import { useState } from "react";
import { api } from "../api/client";
import QueueList from "../components/QueueList";
import { Alert, EmptyState, Field, PageHeader } from "../components/ui";
import { PatientBanner } from "../components/VisitBlocks";
import { useForm } from "../hooks/useForm";
import { useQueue } from "../hooks/useQueue";
import { formatDateTime } from "../utils/format";

export default function Laboratory() {
  const queue = useQueue("lab");
  const [message, setMessage] = useState("");

  return (
    <>
      <PageHeader title="Laboratory" description="Enter test results. Finished patients go back to their doctor." />
      <Alert type="success">{message}</Alert>

      <div className="workspace">
        <QueueList
          title="Tests waiting"
          visits={queue.visits}
          loading={queue.loading}
          error={queue.error}
          selectedId={queue.selectedId}
          onSelect={(id) => {
            queue.select(id);
            setMessage("");
          }}
          renderTag={(visit) => {
            const pending = visit.labTests.filter((t) => !t.result).length;
            return <span className="badge badge-lab">{pending} pending</span>;
          }}
          emptyText="Tests ordered by doctors appear here."
        />

        {queue.selected ? (
          <ResultsForm
            key={queue.selected.id}
            visit={queue.selected}
            onSaved={(visit) => {
              setMessage(
                visit.status === "lab"
                  ? `Results saved for ${visit.patient.name}. Some tests are still pending.`
                  : `All results in. ${visit.patient.name} went back to the doctor.`,
              );
              queue.select(null);
              queue.reload();
            }}
          />
        ) : (
          <div className="card">
            <EmptyState title="Select a patient" description="Pick someone from the queue to enter their results." />
          </div>
        )}
      </div>
    </>
  );
}

function ResultsForm({ visit, onSaved }) {
  const pendingTests = visit.labTests.filter((t) => !t.result);
  const doneTests = visit.labTests.filter((t) => t.result);
  const form = useForm(Object.fromEntries(pendingTests.map((t) => [t.id, ""])));

  async function handleSubmit(event) {
    event.preventDefault();
    const results = Object.entries(form.values)
      .filter(([, result]) => result.trim())
      .map(([testId, result]) => ({ testId, result }));

    await form.submit(async () => {
      if (!results.length) throw new Error("Enter at least one result.");
      const response = await api(`/visits/${visit.id}/lab-results`, { method: "PATCH", body: { results } });
      onSaved(response.visit);
    });
  }

  return (
    <section className="card">
      <div className="card-header">
        <PatientBanner patient={visit.patient} />
      </div>
      <form className="card-body stack" style={{ gap: 20 }} onSubmit={handleSubmit} noValidate>
        <div className="stack" style={{ gap: 6 }}>
          <span className="section-title">Ordered by</span>
          <p>
            {visit.consultation?.doctor?.name} · {formatDateTime(visit.consultation?.updatedAt)}
          </p>
          {visit.consultation?.diagnosis && (
            <p className="muted small">Working diagnosis: {visit.consultation.diagnosis}</p>
          )}
        </div>

        <Alert>{form.formError}</Alert>

        <div className="stack">
          {pendingTests.map((test) => (
            <Field
              key={test.id}
              as="textarea"
              label={test.name}
              name={test.id}
              rows={2}
              placeholder="Result, units and reference range"
              value={form.values[test.id]}
              onChange={form.handleChange}
            />
          ))}
        </div>

        {doneTests.length > 0 && (
          <div className="stack" style={{ gap: 8 }}>
            <span className="section-title">Already completed</span>
            {doneTests.map((test) => (
              <div key={test.id} className="info-item">
                <div className="label">{test.name}</div>
                <div>{test.result}</div>
              </div>
            ))}
          </div>
        )}

        <div>
          <button className="btn btn-primary" disabled={form.submitting}>
            {form.submitting ? "Saving…" : "Save results"}
          </button>
        </div>
      </form>
    </section>
  );
}
