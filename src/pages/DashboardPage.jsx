import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function DashboardPage() {
  const { company } = useAuth();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [recentEmployees, setRecentEmployees] = useState([]);

  useEffect(() => {
    async function loadStats() {
      if (!company) return;

      const { data: employees } = await supabase
        .from("employees")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      const myEmployees = employees || [];
      setEmployeeCount(myEmployees.length);
      setRecentEmployees(myEmployees.slice(0, 5));

      let duplicateHits = 0;

      for (const employee of myEmployees) {
        const { data: matches } = await supabase
          .from("employees")
          .select("*")
          .eq("ic_no", employee.ic_no)
          .neq("company_id", company.id);

        if ((matches || []).length > 0) {
          duplicateHits += 1;
        }
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
                  Manage your active employee records, monitor duplicate IC matches,
                  and keep workforce verification structured across the PGABS network.
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
                <p>Current active employee records.</p>
              </article>

              <article className="dashboard-stat-card-v2 card-green">
                <h3>Flagged Duplicates</h3>
                <div className="dashboard-stat-number">{duplicateCount}</div>
                <p>Potential duplicate IC matches detected.</p>
              </article>

              <article className="dashboard-stat-card-v2 card-pink">
                <h3>Employee Database</h3>
                <p>Manage your current employee records in one place.</p>
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
                      <th>Start Date</th>
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
                          <td>{employee.start_date}</td>
                          <td>{employee.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No employee records found.</td>
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