import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { EmptyState } from "../components/ui";

// <Route element={<ProtectedRoute />}>                    -> any logged-in user
// <Route element={<ProtectedRoute roles={["admin"]} />}>  -> only these roles
export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="card">
        <EmptyState title="Access denied" description="Your role doesn't have access to this page." />
      </div>
    );
  }

  return <Outlet />;
}
