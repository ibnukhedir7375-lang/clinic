import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui";

export default function NotFound() {
  return (
    <div className="card">
      <EmptyState title="Page not found" description="The page you're looking for doesn't exist.">
        <Link to="/" className="btn btn-secondary">
          Go home
        </Link>
      </EmptyState>
    </div>
  );
}
