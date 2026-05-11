import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import VeriHireLogo from "./VeriHireLogo";

const links = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Employee Database", path: "/employees" },
  { name: "Duplication Check", path: "/duplicate-check" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, company } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <VeriHireLogo compact />

        <div className="sidebar-company-block">
          <p className="sidebar-company-label">PGABS Company</p>
          <p className="sidebar-company-name">{company?.name || "Company"}</p>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={
                location.pathname === link.path ? "sidebar-link active" : "sidebar-link"
              }
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer-card">
        <p className="sidebar-footer-title">PGABS Verification Portal</p>
        <p className="sidebar-footer-text">
          Private access for approved PGABS group companies to manage records and
          run duplication checks.
        </p>
      </div>

      <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}