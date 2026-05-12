import { Link } from "react-router-dom";
import VeriHireLogo from "../components/VeriHireLogo";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <VeriHireLogo />

        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#access">Access</a>
        </nav>

        <div className="landing-header-actions">
          <Link to="/login" className="landing-link-btn">
            Login
          </Link>
          <Link to="/register" className="landing-primary-btn small">
            Register
          </Link>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-text">
            <h1 className="landing-hero-title">
              <span className="veri-highlight">Veri</span>fy with Confidence.
              <br />
              <span className="hire-highlight">Hire</span> with Trust.
            </h1>

            <p className="landing-hero-description">
              A private workforce verification platform for approved companies under
              GJPBS to manage employee records and detect overlapping employment
              across participating companies.
            </p>

            <div className="landing-hero-actions">
              <Link to="/login" className="landing-primary-btn">
                Login
              </Link>
              <Link to="/register" className="landing-secondary-btn">
                Register
              </Link>
            </div>
          </div>

          <div className="landing-hero-visual">
            <div className="hero-ui-board">
              <div className="hero-floating-badge hero-floating-badge-top">
                PGABS Private Portal
              </div>

              <div className="hero-ui-main-card">
                <div className="hero-ui-main-top">
                  <div className="hero-ui-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="hero-ui-chip">VeriHire Dashboard</div>
                </div>

                <div className="hero-ui-summary-grid">
                  <div className="hero-ui-summary-card">
                    <small>Total Employees</small>
                    <strong>248</strong>
                  </div>
                  <div className="hero-ui-summary-card highlighted">
                    <small>Flagged Duplicates</small>
                    <strong>12</strong>
                  </div>
                </div>

                <div className="hero-ui-alert-card">
                  <div className="hero-ui-alert-icon">!</div>
                  <div>
                    <h4>Potential overlap detected</h4>
                    <p>Employee IC matched with another active record.</p>
                  </div>
                </div>

                <div className="hero-ui-table-card">
                  <div className="hero-ui-table-head">
                    <span>Recent Checks</span>
                    <span className="hero-ui-link">View All</span>
                  </div>

                  <div className="hero-ui-row">
                    <span>900101-13-1234</span>
                    <span className="status-badge warning">Duplicate Found</span>
                  </div>
                  <div className="hero-ui-row">
                    <span>880202-10-5678</span>
                    <span className="status-badge ok">Clear</span>
                  </div>
                  <div className="hero-ui-row">
                    <span>920606-07-8891</span>
                    <span className="status-badge review">Reviewing</span>
                  </div>
                </div>
              </div>

              <div className="hero-side-stack">
                <div className="hero-mini-card trial-card">
                  <small>Access Type</small>
                  <strong>Approved Company</strong>
                  <span>Restricted to PGABS network</span>
                </div>

                <div className="hero-mini-card employee-card">
                  <small>Record Update</small>
                  <strong>New Hire Added</strong>
                  <span>Status: Offer Accepted</span>
                </div>
              </div>

              <div className="hero-floating-badge hero-floating-badge-bottom">
                Internal Use Only
              </div>
            </div>
          </div>
        </section>

        <section className="landing-features" id="features">
          <div className="landing-section-heading">
            <span className="landing-section-kicker">Features</span>
            <h2>Everything participating companies need</h2>
            <p>
              Built for approved PGABS group companies that need a central system
              for verification and employee record management.
            </p>
          </div>

          <div className="landing-feature-grid">
            <article className="landing-feature-card featured-card">
              <div className="feature-icon-circle blue">✓</div>
              <h3>Cross-company verification</h3>
              <p>
                Run IC-based duplicate checks across participating companies and
                identify overlapping employment periods.
              </p>
            </article>

            <article className="landing-feature-card soft-green">
              <div className="feature-icon-circle green">!</div>
              <h3>Conflict alerts</h3>
              <p>
                Highlight suspicious matches and review flagged cases in a clean,
                easy-to-read results flow.
              </p>
            </article>

            <article className="landing-feature-card soft-pink">
              <div className="feature-icon-circle pink">+</div>
              <h3>Employee database</h3>
              <p>
                Store employee records in one organised place with company-level
                access and clearer visibility.
              </p>
            </article>

            <article className="landing-feature-card soft-lilac">
              <div className="feature-icon-circle lilac">PG</div>
              <h3>Private PGABS access</h3>
              <p>
                Access is restricted to approved companies under the PGABS group
                network only.
              </p>
            </article>
          </div>
        </section>

        <section className="landing-cta-strip" id="access">
          <div className="landing-cta-strip-inner">
            <p>
              Access is restricted to approved PGABS companies. Register using your
              approved company email.
            </p>
            <Link to="/register" className="landing-primary-btn">
              Register
            </Link>
          </div>
        </section>
        <footer className="app-footer-note">developed by qise.studio</footer>
      </main>
    </div>
  );
}