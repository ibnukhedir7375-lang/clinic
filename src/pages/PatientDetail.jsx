import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import { AsyncContent, EmptyState, StatusBadge } from "../components/ui";
import { LabResultsTable, PatientBanner, PrescriptionTable, VitalsGrid } from "../components/VisitBlocks";
import { useApi } from "../hooks/useApi";
import { formatDate, formatDateTime, formatMoney } from "../utils/format";

export default function PatientDetail() {
  const { id } = useParams();
  const { data, loading, error } = useApi(`/patients/${id}`);

  return (
    <>
      <div>
        <Link to="/patients" className="btn btn-ghost btn-sm">
          <Icon name="arrowLeft" size={14} /> All patients
        </Link>
      </div>

      <AsyncContent loading={loading && !data} error={error}>
        {data && (
          <>
            <section className="card card-body">
              <PatientBanner patient={data.patient}>
                <div className="muted small" style={{ textAlign: "right" }}>
                  <div>Registered {formatDate(data.patient.createdAt)}</div>
                  <div>
                    {data.visits.length} visit{data.visits.length === 1 ? "" : "s"}
                  </div>
                </div>
              </PatientBanner>
            </section>

            <h2>Visit history</h2>
            {data.visits.length === 0 ? (
              <div className="card">
                <EmptyState title="No visits yet" description="Visits appear here once the patient checks in." />
              </div>
            ) : (
              <div className="timeline">
                {data.visits.map((visit) => (
                  <VisitCard key={visit.id} visit={visit} />
                ))}
              </div>
            )}
          </>
        )}
      </AsyncContent>
    </>
  );
}

function VisitCard({ visit }) {
  return (
    <article className="card">
      <div className="card-header">
        <div>
          <h3>{formatDateTime(visit.createdAt)}</h3>
          <p className="muted small">
            {visit.reason || "No reason given"} · Paid {formatMoney(visit.fee)}
          </p>
        </div>
        <StatusBadge status={visit.status} />
      </div>

      <div className="card-body stack" style={{ gap: 20 }}>
        <Section title="Vitals">
          <VitalsGrid vitals={visit.vitals} />
        </Section>

        {visit.consultation && (
          <Section title="Consultation">
            <p>
              <strong>{visit.consultation.diagnosis}</strong>
            </p>
            {visit.consultation.notes && <p className="muted">{visit.consultation.notes}</p>}
            <p className="muted small">{visit.consultation.doctor?.name}</p>
          </Section>
        )}

        {visit.labTests.length > 0 && (
          <Section title="Lab results">
            <LabResultsTable tests={visit.labTests} />
          </Section>
        )}

        {visit.prescriptions.length > 0 && (
          <Section title="Prescription">
            <PrescriptionTable prescriptions={visit.prescriptions} />
            {visit.dispensed && (
              <p className="muted small">
                Dispensed by {visit.dispensed.by?.name} · {formatDateTime(visit.dispensed.at)}
              </p>
            )}
          </Section>
        )}
      </div>
    </article>
  );
}

function Section({ title, children }) {
  return (
    <div className="stack" style={{ gap: 8 }}>
      <span className="section-title">{title}</span>
      {children}
    </div>
  );
}
