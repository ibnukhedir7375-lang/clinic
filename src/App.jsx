import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import ProtectedRoute from "./auth/ProtectedRoute";
import Layout from "./components/Layout";
import { homeFor, ROLES } from "./config/roles";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Staff from "./pages/Staff";
import Reception from "./pages/Reception";
import Triage from "./pages/Triage";
import Consultations from "./pages/Consultations";
import Laboratory from "./pages/Laboratory";
import Pharmacy from "./pages/Pharmacy";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  const { user, checking } = useAuth();

  if (checking) {
    return (
      <div className="loading-screen">
        <div className="spinner" role="status" aria-label="Loading" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Everything below requires login */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to={homeFor(user?.role)} replace />} />

          <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="staff" element={<Staff />} />
          </Route>
          <Route element={<ProtectedRoute roles={[ROLES.RECEPTION, ROLES.ADMIN]} />}>
            <Route path="reception" element={<Reception />} />
          </Route>
          <Route element={<ProtectedRoute roles={[ROLES.NURSE]} />}>
            <Route path="triage" element={<Triage />} />
          </Route>
          <Route element={<ProtectedRoute roles={[ROLES.DOCTOR]} />}>
            <Route path="consultations" element={<Consultations />} />
          </Route>
          <Route element={<ProtectedRoute roles={[ROLES.LAB]} />}>
            <Route path="laboratory" element={<Laboratory />} />
          </Route>
          <Route element={<ProtectedRoute roles={[ROLES.PHARMACY]} />}>
            <Route path="pharmacy" element={<Pharmacy />} />
          </Route>

          {/* Every role can look up patients */}
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientDetail />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
