import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const emptyForm = {
  name: "",
  icNo: "",
  position: "",
  project: "",
  client: "",
  startDate: "",
  endDate: "",
  status: "Active",
};

export default function EmployeesPage() {
  const { company } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  async function loadEmployees() {
    if (!company?.id) return;

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("company_id", company.id)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setEmployees(data || []);
  }

  useEffect(() => {
    loadEmployees();
  }, [company]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleEdit(employee) {
    setEditingId(employee.id);
    setForm({
      name: employee.name || "",
      icNo: employee.ic_no || "",
      position: employee.position || "",
      project: employee.project || "",
      client: employee.client || "",
      startDate: employee.start_date || "",
      endDate: employee.end_date || "",
      status: employee.status || "Active",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
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

      if (new Date(form.startDate) > new Date(form.endDate)) {
        setMessage("End Date must be later than or equal to Start Date.");
        return;
      }

      const payload = {
        company_id: company.id,
        name: form.name.trim(),
        ic_no: form.icNo.trim(),
        position: form.position.trim(),
        project: form.project.trim(),
        client: form.client.trim(),
        start_date: form.startDate,
        end_date: form.endDate,
        status: form.status,
      };

      if (editingId) {
        const { error } = await supabase
          .from("employees")
          .update(payload)
          .eq("id", editingId)
          .eq("company_id", company.id);

        if (error) {
          setMessage(error.message);
          return;
        }

        setMessage("Employee updated successfully.");
      } else {
        const { error } = await supabase.from("employees").insert([payload]);

        if (error) {
          setMessage(error.message);
          return;
        }

        setMessage("Employee saved successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
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
                  Add, update, and manage employee records, including project,
                  client, and employment period across the GJPBS network.
                </p>
              </div>
            </div>

            <div className="dashboard-table-panel-v2">
              <div className="dashboard-panel-head-v2">
                <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>
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
                    <option>Inactive</option>
                  </select>
                </div>

                <div>
                  <label>Project</label>
                  <input
                    value={form.project}
                    onChange={(e) => handleChange("project", e.target.value)}
                    placeholder="e.g. Project Alpha"
                  />
                </div>

                <div>
                  <label>Client</label>
                  <input
                    value={form.client}
                    onChange={(e) => handleChange("client", e.target.value)}
                    placeholder="e.g. PETRONAS"
                  />
                </div>

                <div>
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    required
                  />
                </div>

                <div
                  className="full-span"
                  style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
                >
                  <button type="submit" disabled={loading}>
                    {loading
                      ? editingId
                        ? "Updating..."
                        : "Saving..."
                      : editingId
                      ? "Update Employee"
                      : "Save Employee"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      className="landing-secondary-btn"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
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
                      <th>Project</th>
                      <th>Client</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.length > 0 ? (
                      employees.map((employee) => (
                        <tr key={employee.id}>
                          <td>{employee.name}</td>
                          <td>{employee.ic_no}</td>
                          <td>{employee.position}</td>
                          <td>{employee.project || "-"}</td>
                          <td>{employee.client || "-"}</td>
                          <td>{employee.start_date || "-"}</td>
                          <td>{employee.end_date || "-"}</td>
                          <td>{employee.status}</td>
                          <td>
                            <button
                              type="button"
                              className="landing-secondary-btn"
                              onClick={() => handleEdit(employee)}
                              style={{ padding: "8px 14px" }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9">No employee records found.</td>
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