export default function VeriHireLogo({ compact = false }) {
  return (
    <div className={compact ? "vh-logo compact" : "vh-logo"}>
      <div className="vh-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="vh-logo-svg">
          <defs>
            <linearGradient id="vhVGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#24408f" />
              <stop offset="55%" stopColor="#5f7fcd" />
              <stop offset="100%" stopColor="#b49ae7" />
            </linearGradient>
          </defs>

          <path
            d="M18 14h26L60 44l16-30h26L66 102H54L18 14z"
            fill="url(#vhVGrad)"
          />
          <path
            d="M55 52l8 10 18-24"
            fill="none"
            stroke="#f8f4ec"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="vh-logo-texts">
        <div className="vh-logo-wordmark">
          <span className="vh-veri">Veri</span>
          <span className="vh-hire">Hire</span>
        </div>
        <div className="vh-logo-tagline">Smarter workforce verification</div>
      </div>
    </div>
  );
}