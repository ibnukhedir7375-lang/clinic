import { Link } from "react-router-dom";
import { AsyncContent, EmptyState, PageHeader, StatusBadge } from "../components/ui";
import { VISIT_STATUS_LABELS } from "../config/clinic";
import { useApi } from "../hooks/useApi";
import { formatMoney, formatTime } from "../utils/format";

const STAGES = ["triage", "consultation", "lab", "pharmacy", "completed"];

export default function Dashboard() {
  const { data, loading, error, reload } = useApi("/stats");

  return (
    <>
      <PageHeader title="Dashboard" description="Today at a glance.">
        <button className="btn btn-secondary" onClick={reload}>
          Refresh
        </button>
      </PageHeader>

      <AsyncContent loading={loading && !data} error={error}>
        {data && (
          <>
            <div className="stats">
              <Stat label="Visits today" value={data.totals.visitsToday} />
              <Stat label="Revenue today" value={formatMoney(data.totals.revenueToday)} />
              <Stat label="Registered patients" value={data.totals.patients} />
              <Stat label="Active staff" value={data.totals.activeStaff} />
            </div>

            <section className="card">
              <div className="card-header">
                <h2>Patient flow right now</h2>
              </div>
              <div className="stage-list">
                {STAGES.map((stage) => (
                  <div className="stage" key={stage}>
                    <StatusBadge status={stage} />
                    <span className="value">{data.queues[stage]}</span>
                    <span className="muted small">
                      {stage === "completed" ? "finished today" : `patient${data.queues[stage] === 1 ? "" : "s"} ${VISIT_STATUS_LABELS[stage].toLowerCase()}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <div className="card-header">
                <h2>Recent visits</h2>
                <Link to="/patients" className="small">
                  All patients
                </Link>
              </div>
              {data.recentVisits.length ? (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Reason</th>
                        <th>Time</th>
                        <th>Fee</th>
                        <th>Stage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentVisits.map((visit) => (
                        <tr key={visit.id}>
                          <td>
                            <Link to={`/patients/${visit.patientId}`}>{visit.patient?.name}</Link>
                          </td>
                          <td className="muted">{visit.reason || "—"}</td>
                          <td className="num">{formatTime(visit.createdAt)}</td>
                          <td className="num">{formatMoney(visit.fee)}</td>
                          <td>
                            <StatusBadge status={visit.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No visits yet" description="Visits started at reception will show up here." />
              )}
            </section>
          </>
        )}
      </AsyncContent>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}
