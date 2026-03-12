import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "⬡" },
  { to: "/schedule", label: "Schedule", icon: "◈" },
  { to: "/subjects", label: "Subjects", icon: "∑" },
  { to: "/ai", label: "AI Assistant", icon: "✦" },
];

function Navbar() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500&display=swap');

        .navbar {
          font-family: 'Montserrat', sans-serif;
          background: #1a160f;
          border-bottom: 1px solid rgba(184,151,90,0.18);
          box-shadow: 0 4px 32px rgba(0,0,0,0.35);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
        }

        .navbar-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .navbar-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 400;
          color: #e8dcc8;
          text-decoration: none;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: opacity 0.2s;
        }
        .navbar-brand:hover { opacity: 0.8; }

        .brand-icon {
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #b8975a, #8a6d38);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: #fff8ee;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(184,151,90,0.15);
          border-radius: 14px;
          padding: 5px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.8px;
          color: #9a8a6a;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: #e8dcc8;
          background: rgba(184,151,90,0.1);
        }
        .nav-link.active {
          background: linear-gradient(135deg, #b8975a, #8a6d38);
          color: #fff8ee;
          font-weight: 500;
          box-shadow: 0 4px 14px rgba(139,107,52,0.35);
        }
        .nav-link.active .nav-icon { opacity: 1; }

        .nav-icon {
          font-size: 13px;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .nav-link:hover .nav-icon { opacity: 1; }

        .nav-divider {
          width: 1px; height: 16px;
          background: rgba(184,151,90,0.15);
          margin: 0 2px;
        }

        .nav-badge {
          font-size: 9px;
          padding: 1px 6px;
          border-radius: 10px;
          background: rgba(184,151,90,0.15);
          color: #b8975a;
          border: 1px solid rgba(184,151,90,0.2);
          letter-spacing: 1px;
        }

        .top-accent {
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #b8975a60, transparent);
        }

        /* Account Button */
        .account-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px 6px 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(184,151,90,0.18);
          border-radius: 40px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .account-btn:hover {
          background: rgba(184,151,90,0.08);
          border-color: rgba(184,151,90,0.4);
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        .account-btn.open {
          border-color: #b8975a;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        }

        .account-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #b8975a, #8a6d38);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px; color: #fff8ee; font-weight: 500;
          flex-shrink: 0;
        }

        .account-name {
          font-size: 12px; font-weight: 500;
          color: #e8dcc8; letter-spacing: 0.3px; line-height: 1;
        }
        .account-role {
          font-size: 10px; color: #7a6a4a;
          letter-spacing: 1px; text-transform: uppercase; line-height: 1;
          margin-top: 2px;
        }

        .account-chevron {
          font-size: 10px; color: #b8975a;
          transition: transform 0.25s; margin-left: 2px;
        }
        .account-chevron.open { transform: rotate(180deg); }

        /* Dropdown */
        .dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 268px;
          background: #1e1810;
          border: 1px solid rgba(184,151,90,0.2);
          border-radius: 16px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3);
          overflow: hidden;
          animation: dropIn 0.25s cubic-bezier(0.16,1,0.3,1) both;
          z-index: 200;
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dropdown-top-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, #b8975a, transparent);
        }

        .dropdown-header {
          padding: 18px 20px 14px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid rgba(184,151,90,0.12);
          background: rgba(184,151,90,0.04);
        }

        .dropdown-avatar {
          width: 46px; height: 46px; border-radius: 50%;
          background: linear-gradient(135deg, #b8975a, #8a6d38);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; color: #fff8ee;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          flex-shrink: 0;
        }

        .dropdown-username {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; color: #e8dcc8;
          font-weight: 400; letter-spacing: 0.5px; line-height: 1.2;
        }
        .dropdown-email {
          font-size: 11px; color: #6a5a3a; letter-spacing: 0.3px; margin-top: 2px;
        }

        .dropdown-stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1px;
          background: rgba(184,151,90,0.08);
          border-bottom: 1px solid rgba(184,151,90,0.12);
        }
        .stat-cell {
          background: #1a160f;
          padding: 12px 8px;
          text-align: center;
        }
        .stat-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; color: #b8975a; line-height: 1;
        }
        .stat-lbl {
          font-size: 9px; color: #6a5a3a;
          text-transform: uppercase; letter-spacing: 1px; margin-top: 2px;
        }

        .dropdown-menu { padding: 8px; }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 12px;
          color: #a89070;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          letter-spacing: 0.3px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: 'Montserrat', sans-serif;
          text-decoration: none;
        }
        .dropdown-item:hover {
          background: rgba(184,151,90,0.08);
          color: #e8dcc8;
        }
        .dropdown-item.danger:hover {
          background: rgba(192,57,43,0.1);
          color: #e07060;
        }

        .dropdown-item-icon {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(184,151,90,0.08);
          border: 1px solid rgba(184,151,90,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0;
          transition: background 0.2s;
        }
        .dropdown-item:hover .dropdown-item-icon {
          background: rgba(184,151,90,0.15);
        }
        .dropdown-item.danger:hover .dropdown-item-icon {
          background: rgba(192,57,43,0.1);
          border-color: rgba(192,57,43,0.2);
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(184,151,90,0.1);
          margin: 4px 8px;
        }

        .online-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #6aaa6a;
          border: 1.5px solid #1a160f;
          position: absolute; bottom: 0; right: 0;
        }
      `}</style>

      <nav className="navbar">
        <div className="top-accent" />
        <div className="navbar-inner">

          {/* Brand */}
          <Link to="/dashboard" className="navbar-brand">
            <div className="brand-icon">✦</div>
            StudyHelper
          </Link>

          {/* Nav Links */}
          <div className="nav-links">
            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.to;
              return (
                <div key={link.to} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && !isActive && location.pathname !== navLinks[i - 1]?.to && (
                    <div className="nav-divider" />
                  )}
                  <Link to={link.to} className={`nav-link ${isActive ? "active" : ""}`}>
                    <span className="nav-icon">{link.icon}</span>
                    {link.label}
                    {link.to === "/ai" && !isActive && (
                      <span className="nav-badge">AI</span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Account Button */}
          <div style={{ position: "relative" }}>
            <button
              className={`account-btn ${dropdownOpen ? "open" : ""}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div style={{ position: "relative" }}>
                <div className="account-avatar">A</div>
                <div className="online-dot" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="account-name">Alex Johnson</div>
                <div className="account-role">Student</div>
              </div>
              <span className={`account-chevron ${dropdownOpen ? "open" : ""}`}>▼</span>
            </button>

            {dropdownOpen && (
              <div className="dropdown">
                <div className="dropdown-top-line" />

                <div className="dropdown-header">
                  <div className="dropdown-avatar">A</div>
                  <div>
                    <div className="dropdown-username">Alex Johnson</div>
                    <div className="dropdown-email">alex.johnson@email.com</div>
                    <div style={{ marginTop: "6px" }}>
                      <span style={{
                        fontSize: "9px", padding: "2px 8px", borderRadius: "10px",
                        background: "rgba(106,170,106,0.1)", color: "#5a9a5a",
                        border: "1px solid rgba(106,170,106,0.2)", letterSpacing: "1px"
                      }}>
                        ● Online
                      </span>
                    </div>
                  </div>
                </div>

                <div className="dropdown-stats">
                  {[
                    { val: "12", lbl: "Streak" },
                    { val: "4", lbl: "Subjects" },
                    { val: "18h", lbl: "This Week" },
                  ].map((s) => (
                    <div key={s.lbl} className="stat-cell">
                      <div className="stat-val">{s.val}</div>
                      <div className="stat-lbl">{s.lbl}</div>
                    </div>
                  ))}
                </div>

                <div className="dropdown-menu">
                  {[
                    { icon: "◈", label: "My Profile" },
                    { icon: "⚙", label: "Settings" },
                    { icon: "🔔", label: "Notifications" },
                    { icon: "📊", label: "Progress Report" },
                  ].map((item) => (
                    <button key={item.label} className="dropdown-item">
                      <div className="dropdown-item-icon">{item.icon}</div>
                      {item.label}
                    </button>
                  ))}

                  <div className="dropdown-divider" />

                  <button className="dropdown-item danger">
                    <div className="dropdown-item-icon">↩</div>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </nav>

      {dropdownOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;