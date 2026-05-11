import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function EmployeesPage() {
  const { company } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    icNo: "",
    position: "",
    startDate: "",
    status: "Active",
  });

  async function loadEmployees() {
    if (!company?.id) return;

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("company_id", company.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setEmployees(data || []);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, [company]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!company?.id) {
        setMessage("Company not loaded yet.");
        return;
      }

      const { error } = await supabase.from("employees").insert([
        {
          company_id: company.id,
          name: form.name.trim(),
          ic_no: form.icNo.trim(),
          position: form.position.trim(),
          start_date: form.startDate,
          status: form.status,
        },
      ]);

      if (error) {
        setMessage(error.message);
        return;
      }

      setForm({
        name: "",
        icNo: "",
        position: "",
        startDate: "",
        status: "Active",
      });

      setMessage("Employee saved successfully.");
      await loadEmployees();
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-layout dashboard-shell-v2">
      <Sidebar />

      <main className="dashboard-main-v2">
        <div className="dashboard-layout-v2 single-column">
          <section className="dashboard-center-column">
            <div className="dashboard-welcome-card dashboard-welcome-card-simple">
              <div className="dashboard-welcome-copy">
                <h1>Employee Database</h1>
                <p>
                  Add and manage your company’s real-time employee records in one
                  structured workspace.
                </p>
              </div>
            </div>

            <div className="dashboard-table-panel-v2">
              <div className="dashboard-panel-head-v2">
                <h2>Add Employee</h2>
              </div>

              <form className="form-grid" onSubmit={handleSubmit}>
                <div>
                  <label>Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>IC No.</label>
                  <input
                    value={form.icNo}
                    onChange={(e) => handleChange("icNo", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Position</label>
                  <input
                    value={form.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <option>Active</option>
                    <option>Onboarding</option>
                    <option>Pending</option>
                  </select>
                </div>

                <div className="full-span">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    required
                  />
                </div>

                <div className="full-span">
                  <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Employee"}
                  </button>
                </div>
              </form>

              {message && <p className="auth-message">{message}</p>}
            </div>

            <div className="dashboard-table-panel-v2">
              <div className="dashboard-panel-head-v2">
                <h2>Employee Records</h2>
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
                    {employees.length > 0 ? (
                      employees.map((employee) => (
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