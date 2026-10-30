// Read-only building blocks for showing a visit: patient banner, vitals,
// lab results and prescriptions. Reused by several pages.
import { capitalize, formatDateTime, formatPhone, initials } from "../utils/format";

export function PatientBanner({ patient, children }) {
  if (!patient) return null;
  return (
    <div className="spread">
      <div className="patient-banner">
        <span className="avatar">{initials(patient.name)}</span>
        <div>
          <h2>{patient.name}</h2>
          <p className="muted small">
            {capitalize(patient.gender)} · {patient.age} yrs · {formatPhone(patient.phone)}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

const VITALS = [
  { key: "bloodPressure", label: "Blood pressure", unit: "mmHg" },
  { key: "pulse", label: "Pulse", unit: "bpm" },
  { key: "temperature", label: "Temperature", unit: "°C" },
  { key: "saturation", label: "SpO₂", unit: "%" },
  { key: "weight", label: "Weight", unit: "kg" },
  { key: "sugar", label: "Blood sugar", unit: "mg/dL" },
];

export function VitalsGrid({ vitals }) {
  if (!vitals) return <p className="muted small">Vitals not recorded yet.</p>;
  return (
    <div className="stack" style={{ gap: 8 }}>
      <div className="info-grid">
        {VITALS.map(({ key, label, unit }) => (
          <div className="info-item" key={key}>
            <div className="label">{label}</div>
            <div className="value">
              {vitals[key] ?? "—"}
              {vitals[key] != null && <span className="unit">{unit}</span>}
            </div>
          </div>
        ))}
      </div>
      <p className="muted small">
        Recorded by {vitals.recordedBy?.name} · {formatDateTime(vitals.recordedAt)}
      </p>
    </div>
  );
}

export function LabResultsTable({ tests }) {
  if (!tests?.length) return <p className="muted small">No lab tests ordered.</p>;
  return (
    <div className="card table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Result</th>
            <th>Technician</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id}>
              <td>{test.name}</td>
              <td>{test.result ?? <span className="badge badge-lab">Pending</span>}</td>
              <td className="muted">{test.technician?.name ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PrescriptionTable({ prescriptions }) {
  if (!prescriptions?.length) return <p className="muted small">No medication prescribed.</p>;
  return (
    <div className="card table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Drug</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((p) => (
            <tr key={p.id}>
              <td>
                <strong>{p.drug}</strong>
              </td>
              <td>{p.dosage}</td>
              <td>{p.frequency}</td>
              <td>{p.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
