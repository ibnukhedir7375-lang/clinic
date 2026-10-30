import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { AsyncContent, EmptyState, PageHeader, SearchInput } from "../components/ui";
import { ROLES } from "../config/roles";
import { useApi } from "../hooks/useApi";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { capitalize, formatDate, formatPhone } from "../utils/format";

export default function Patients() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search.trim());
  const { data, loading, error } = useApi(`/patients?search=${encodeURIComponent(query)}`);
  const canRegister = [ROLES.RECEPTION, ROLES.ADMIN].includes(user.role);

  return (
    <>
      <PageHeader title="Patients" description="Search the patient register and open a medical history.">
        {canRegister && (
          <Link to="/reception" className="btn btn-primary">
            Register patient
          </Link>
        )}
      </PageHeader>

      <section className="card">
        <div className="card-header">
          <div style={{ flex: 1, maxWidth: 420 }}>
            <SearchInput
              placeholder="Search by name or phone"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search patients"
            />
          </div>
          {data && <span className="muted small">{data.patients.length} shown</span>}
        </div>

        <AsyncContent loading={loading && !data} error={error}>
          {data?.patients.length ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {data.patients.map((patient) => (
                    <tr key={patient.id} className="clickable" onClick={() => navigate(`/patients/${patient.id}`)}>
                      <td>
                        <Link to={`/patients/${patient.id}`} onClick={(e) => e.stopPropagation()}>
                          {patient.name}
                        </Link>
                      </td>
                      <td className="num">{formatPhone(patient.phone)}</td>
                      <td>{capitalize(patient.gender)}</td>
                      <td className="num">{patient.age}</td>
                      <td className="muted">{formatDate(patient.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title={search ? "No matches" : "No patients yet"}
              description={search ? "Try a different name or phone number." : "Registered patients will appear here."}
            />
          )}
        </AsyncContent>
      </section>
    </>
  );
}
