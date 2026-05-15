import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import VeriHireLogo from "../components/VeriHireLogo";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
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
      const companyName = form.companyName.trim();
      const email = form.email.trim().toLowerCase();

      if (!companyName) {
        setMessage("Company name is required.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setMessage("Passwords do not match.");
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

      const { error: companyError } = await supabase.from("companies").insert([
        {
          name: companyName,
          email,
          owner_user_id: userId,
        },
      ]);

      if (companyError) {
        setMessage(companyError.message);
        return;
      }

      setMessage("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error("register unexpected error:", err);
      setMessage("Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-decoration-panel">
        <div className="auth-decoration-inner">
          <VeriHireLogo compact />
          <h2>Register your account</h2>
          <p>
            Create your company account to access the employee verification
            platform.
          </p>
        </div>
      </div>

      <div className="auth-page">
        <div className="auth-card styled-auth-card">
          <div className="auth-logo-row">
            <VeriHireLogo compact />
          </div>

          <div className="auth-copy-block">
            <h1>Create Account</h1>
            <p>Register your company and login as usual.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div>
              <label>Company Name</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>

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
      </div>
    </div>
  );
}