import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import VeriHireLogo from "../components/VeriHireLogo";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      const userId = data.user?.id;

      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_user_id", userId)
        .maybeSingle();

      if (companyError || !company) {
        await supabase.auth.signOut();
        setMessage(
          "This account is not linked to an approved PGABS company. Please contact the administrator."
        );
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("login unexpected error:", err);
      setMessage("Login failed unexpectedly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-dashboard-page">
      <div className="auth-dashboard-shell">
        <header className="auth-dashboard-topbar">
          <VeriHireLogo compact />
          <Link to="/" className="landing-link-btn">
            Back to Home
          </Link>
        </header>

        <section className="auth-dashboard-hero">
          <div className="auth-dashboard-copy">
            <p className="page-kicker">PGABS Private Portal</p>
            <h1>Login</h1>
            <p className="page-lead">
              Sign in to access your company workspace, manage employee records,
              and run duplication checks across participating PGABS companies.
            </p>
          </div>
        </section>

        <section className="auth-dashboard-grid">
          <div className="dashboard-panel auth-info-panel">
            <div className="panel-header">
              <h2>Access Information</h2>
            </div>

            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <span className="auth-feature-icon blue">✓</span>
                <div>
                  <strong>Approved company access only</strong>
                  <p>Only registered PGABS companies can sign in.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <span className="auth-feature-icon green">!</span>
                <div>
                  <strong>Cross-company duplicate checks</strong>
                  <p>Identify employee IC duplication across participating companies.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <span className="auth-feature-icon lilac">PG</span>
                <div>
                  <strong>Private internal platform</strong>
                  <p>This system is intended for PGABS network companies only.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-panel auth-form-panel-card">
            <div className="panel-header">
              <h2>Sign In</h2>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="company@email.com"
                  required
                />
              </div>

              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {message && <p className="auth-message">{message}</p>}

            <p className="auth-footer">
              Don’t have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}