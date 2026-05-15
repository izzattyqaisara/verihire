import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function normalizeIc(value) {
  return String(value || "").replace(/\D/g, "");
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  if (!aStart || !aEnd || !bStart || !bEnd) return false;
  return new Date(aStart) <= new Date(bEnd) && new Date(aEnd) >= new Date(bStart);
}

export default function DashboardPage() {
  const { company } = useAuth();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [recentEmployees, setRecentEmployees] = useState([]);

  useEffect(() => {
    async function loadStats() {
      if (!company?.id) return;

      const { data: employees, error } = await supabase
        .from("employees")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed loading employees:", error);
        return;
      }

      const myEmployees = employees || [];
      setEmployeeCount(myEmployees.length);
      setRecentEmployees(myEmployees.slice(0, 5));

      let duplicateHits = 0;

      for (const employee of myEmployees) {
        const cleanedIc = normalizeIc(employee.ic_no);
        if (!cleanedIc || !employee.start_date || !employee.end_date) continue;

        const { data: matches, error: matchError } = await supabase
          .from("employees")
          .select("*")
          .neq("company_id", company.id);

        if (matchError) {
          console.error("Failed loading matches:", matchError);
          continue;
        }

        const hasOverlap = (matches || []).some((match) => {
          return (
            normalizeIc(match.ic_no) === cleanedIc &&
            rangesOverlap(
              employee.start_date,
              employee.end_date,
              match.start_date,
              match.end_date
            )
          );
        });

        if (hasOverlap) duplicateHits += 1;
      }

      setDuplicateCount(duplicateHits);
    }

    loadStats();
  }, [company]);

  return (
    <div className="app-layout dashboard-shell-v2">
      <Sidebar />

      <main className="dashboard-main-v2">
        <div className="dashboard-layout-v2 single-column">
          <section className="dashboard-center-column">
            <div className="dashboard-welcome-card dashboard-welcome-card-simple">
              <div className="dashboard-welcome-copy">
                <h1>Welcome back, {company?.name || "Company"}!</h1>
                <p>
                  Manage employee records, assigned projects, clients, and monitor
                  duplicate IC matches across companies.
                </p>

                <div className="dashboard-welcome-actions">
                  <Link to="/employees" className="primary-btn">
                    Add Employee
                  </Link>
                  <Link to="/duplicate-check" className="landing-secondary-btn">
                    Run Check
                  </Link>
                </div>
              </div>
            </div>

            <div className="dashboard-stat-grid-v2">
              <article className="dashboard-stat-card-v2 card-blue">
                <h3>Total Employees</h3>
                <div className="dashboard-stat-number">{employeeCount}</div>
                <p>Current employee records in your company database.</p>
              </article>

              <article className="dashboard-stat-card-v2 card-green">
                <h3>Flagged Duplicates</h3>
                <div className="dashboard-stat-number">{duplicateCount}</div>
                <p>Same IC with overlapping employment range across companies.</p>
              </article>

              <article className="dashboard-stat-card-v2 card-pink">
                <h3>Employee Database</h3>
                <p>Manage employee records, project, client, and employment dates.</p>
                <Link to="/employees" className="dashboard-card-link">
                  Open Database
                </Link>
              </article>
            </div>

            <div className="dashboard-table-panel-v2">
              <div className="dashboard-panel-head-v2">
                <h2>Recent Employees</h2>
                <Link to="/employees" className="dashboard-card-link">
                  View All
                </Link>
              </div>

              <div className="soft-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>IC No.</th>
                      <th>Position</th>
                      <th>Project</th>
                      <th>Client</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEmployees.length > 0 ? (
                      recentEmployees.map((employee) => (
                        <tr key={employee.id}>
                          <td>{employee.name}</td>
                          <td>{employee.ic_no}</td>
                          <td>{employee.position}</td>
                          <td>{employee.project || "-"}</td>
                          <td>{employee.client || "-"}</td>
                          <td>{employee.start_date || "-"}</td>
                          <td>{employee.end_date || "-"}</td>
                          <td>{employee.status || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">No employee records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        <footer className="app-footer-note">developed by qise.studio</footer>
      </main>
    </div>
  );
}