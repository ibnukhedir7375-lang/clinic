import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { navFor, ROLE_LABELS } from "../config/roles";
import { initials } from "../utils/format";
import Icon from "./Icon";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Icon name="cross" size={16} fill="currentColor" stroke="none" />
          </span>
          Jibreel Clinic
        </Link>

        <nav className="nav" aria-label="Main">
          {navFor(user.role).map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-link">
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="user-card">
          <span className="avatar">{initials(user.name)}</span>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="muted small">{ROLE_LABELS[user.role]}</div>
          </div>
          <button className="btn btn-ghost icon-btn" onClick={logout} title="Log out" aria-label="Log out">
            <Icon name="logout" />
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="main-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
