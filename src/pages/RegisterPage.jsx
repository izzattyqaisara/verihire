import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import VeriHireLogo from "../components/VeriHireLogo";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
      if (form.password !== form.confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }

      const email = form.email.trim().toLowerCase();

      const { data: approvedCompany, error: companyLookupError } = await supabase
        .from("companies")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (companyLookupError) {
        setMessage(companyLookupError.message);
        return;
      }

      if (!approvedCompany) {
        setMessage(
          "This email is not in the approved PGABS company list. Please contact the administrator."
        );
        return;
      }

      if (approvedCompany.owner_user_id) {
        setMessage(
          "This company account has already been registered. Please login or contact the administrator."
        );
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password: form.password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        setMessage("Account created, but user session was not returned.");
        return;
      }

      const { error: updateError } = await supabase
        .from("companies")
        .update({
          owner_user_id: userId,
        })
        .eq("id", approvedCompany.id);

      if (updateError) {
        setMessage(updateError.message);
        return;
      }

      setMessage("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong during registration.");
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
            <h1>Register</h1>
            <p className="page-lead">
              Register using your approved PGABS company email to access the private
              employee verification platform.
            </p>
          </div>
        </section>

        <section className="auth-dashboard-grid">
          <div className="dashboard-panel auth-info-panel">
            <div className="panel-header">
              <h2>Registration Rules</h2>
            </div>

            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <span className="auth-feature-icon blue">✓</span>
                <div>
                  <strong>Approved company email required</strong>
                  <p>Your email must already exist in the PGABS company list.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <span className="auth-feature-icon pink">+</span>
                <div>
                  <strong>One account per approved company</strong>
                  <p>Each company registration is linked to its pre-approved record.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <span className="auth-feature-icon lilac">PG</span>
                <div>
                  <strong>Private PGABS access</strong>
                  <p>This is not open public registration.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-panel auth-form-panel-card">
            <div className="panel-header">
              <h2>Create Account</h2>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div>
                <label>Approved Company Email</label>
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
                  placeholder="Create password"
                  required
                />
              </div>

              <div>
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Confirm password"
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {message && <p className="auth-message">{message}</p>}

            <p className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}