import "./Navbar.css";

const TABS = [
  { id: "browse", label: "Browse" },
  { id: "list", label: "Reading List" },
  { id: "reader", label: "Ask a Reader" },
];

export default function Navbar({ active, onNavigate, theme, onToggleTheme, listCount }) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button className="brand" onClick={() => onNavigate("browse")} aria-label="Shelved home">
          <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
            <rect x="14" y="12" width="10" height="40" rx="2" fill="var(--gilt)" />
            <rect x="27" y="10" width="10" height="42" rx="2" fill="var(--stamp)" />
            <rect x="40" y="14" width="10" height="38" rx="2" fill="var(--moss)" />
          </svg>
          <span className="brand-name">Shelved</span>
        </button>

        <nav className="navbar-tabs" aria-label="Sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`navbar-tab ${active === tab.id ? "is-active" : ""}`}
              onClick={() => onNavigate(tab.id)}
              aria-current={active === tab.id ? "page" : undefined}
            >
              {tab.label}
              {tab.id === "list" && listCount > 0 && (
                <span className="tab-count">{listCount}</span>
              )}
            </button>
          ))}
        </nav>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
          title={theme === "dark" ? "Day mode" : "Night mode"}
        >
          {theme === "dark" ? "☀︎" : "☾"}
        </button>
      </div>
    </header>
  );
}
