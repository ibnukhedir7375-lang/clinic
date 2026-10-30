import { timeAgo } from "../utils/format";
import { Alert, EmptyState, Spinner } from "./ui";

// Left-hand list of patients waiting at a stage (triage, lab, pharmacy...).
export default function QueueList({ title, visits, loading, error, selectedId, onSelect, renderTag, emptyText }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>{title}</h2>
        <span className="badge badge-plain">{visits.length} waiting</span>
      </div>

      {error ? (
        <div className="card-body">
          <Alert>{error.message}</Alert>
        </div>
      ) : loading ? (
        <Spinner />
      ) : visits.length === 0 ? (
        <EmptyState title="Queue is empty" description={emptyText ?? "New patients will show up here."} />
      ) : (
        <div className="queue">
          {visits.map((visit, index) => (
            <button
              key={visit.id}
              type="button"
              className={`queue-item ${visit.id === selectedId ? "selected" : ""}`}
              onClick={() => onSelect(visit.id)}
            >
              <div className="spread">
                <div className="row">
                  <span className="queue-number">{index + 1}</span>
                  <span className="name">{visit.patient?.name ?? "Unknown patient"}</span>
                </div>
                <span className="muted small">{timeAgo(visit.updatedAt)}</span>
              </div>
              <div className="spread">
                <span className="muted small">{visit.reason || "No reason given"}</span>
                {renderTag?.(visit)}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
