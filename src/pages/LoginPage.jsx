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
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (error) {
        setMessage(error.message);
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
    <div className="auth-shell">
      <div className="auth-decoration-panel">
        <div className="auth-decoration-inner">
          <VeriHireLogo compact />
          <h2>Welcome back</h2>
          <p>
            Sign in to continue managing employee records and duplication checks
            for your company.
          </p>
        </div>
      </div>

      <div className="auth-page">
        <div className="auth-card styled-auth-card">
          <div className="auth-logo-row">
            <VeriHireLogo compact />
          </div>

          <div className="auth-copy-block">
            <h1>Login</h1>
            <p>Sign in to your company workspace.</p>
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
      </div>
    </div>
  );
}