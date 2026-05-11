import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function DuplicateCheckPage() {
  const { company } = useAuth();
  const [form, setForm] = useState({
    icNo: "",
    startDate: "",
  });
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setResults([]);

    if (!company) {
      setMessage("Company not found.");
      return;
    }

    const { data, error } = await supabase
      .from("employees")
      .select("id, company_id, name, ic_no, position, start_date, status")
      .eq("ic_no", form.icNo)
      .neq("company_id", company.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    const filtered = (data || []).filter((record) => {
      if (!record.start_date || !form.startDate) return false;
      return new Date(record.start_date) <= new Date(form.startDate);
    });

    const uniqueCompanyIds = [...new Set(filtered.map((item) => item.company_id))];

    if (uniqueCompanyIds.length > 0) {
      const { data: companyRows } = await supabase
        .from("companies")
        .select("id, name")
        .in("id", uniqueCompanyIds);

      const companyMap = Object.fromEntries(
        (companyRows || []).map((row) => [row.id, row.name])
      );

      const decorated = filtered.map((row) => ({
        ...row,
        company_name: companyMap[row.company_id] || row.company_id,
      }));

      setResults(decorated);
      return;
    }

    setMessage("No duplication found.");
  }

  return (
    <div className="app-layout dashboard-shell-v2">
      <Sidebar />

      <main className="dashboard-main-v2">
        <div className="dashboard-layout-v2 single-column">
          <section className="dashboard-center-column">
            <div className="dashboard-welcome-card dashboard-welcome-card-simple">
              <div className="dashboard-welcome-copy">
                <h1>Duplication Check</h1>
                <p>
                  Verify whether an employee IC already exists under another
                  participating PGABS company before the proposed start date.
                </p>
              </div>
            </div>

            <div className="dashboard-table-panel-v2">
              <div className="dashboard-panel-head-v2">
                <h2>Run Check</h2>
              </div>

              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="full-span">
                  <label>IC Number</label>
                  <input
                    value={form.icNo}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, icNo: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="full-span">
                  <label>Proposed Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="full-span">
                  <button type="submit">Run Check</button>
                </div>
              </form>

              {message && <p className="auth-message">{message}</p>}
            </div>

            <div className="dashboard-table-panel-v2">
              <div className="dashboard-panel-head-v2">
                <h2>Check Results</h2>
              </div>

              {results.length > 0 ? (
                <div className="soft-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Matched Company</th>
                        <th>Name</th>
                        <th>IC No.</th>
                        <th>Position</th>
                        <th>Start Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((record) => (
                        <tr key={record.id}>
                          <td>{record.company_name}</td>
                          <td>{record.name}</td>
                          <td>{record.ic_no}</td>
                          <td>{record.position}</td>
                          <td>{record.start_date}</td>
                          <td>{record.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                !message && <p>No results yet.</p>
              )}
            </div>
          </section>
        </div>

        <footer className="app-footer-note">developed by qise.studio</footer>
      </main>
    </div>
  );
}