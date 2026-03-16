import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const BASE = "http://localhost:8000/api/v1";

function ProfilePage() {
  const { user }   = useUser();
  const navigate   = useNavigate();

  const [subjectCount,      setSubjectCount]      = useState("—");
  const [taskCount,         setTaskCount]         = useState("—");
  const [weeklyTasksDone,   setWeeklyTasksDone]   = useState("—");
  const [weeklyFocusHours,  setWeeklyFocusHours]  = useState("—"); // ← new
  const [weeklySubjects,    setWeeklySubjects]     = useState("—"); // ← new
  const [weeklyFocusLabel,  setWeeklyFocusLabel]  = useState("—"); // ← new: "1h 45m" format

  const [goals, setGoals] = useState({
    weeklyStudyHours:      25,
    weeklyTasksCompleted:  12,
    weeklySubjectsCovered: 5,
  });

  useEffect(() => {
    // total subjects enrolled
    fetch(`${BASE}/subjects`)
      .then((r) => r.json())
      .then((data) => setSubjectCount(data.length));

    // total + weekly tasks done
    fetch(`${BASE}/stats`)
      .then((r) => r.json())
      .then((data) => {
        setTaskCount(data.totalTasksDone);
        setWeeklyTasksDone(data.weeklyTasksDone);
      });

    // goals from DB
    fetch(`${BASE}/goals`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setGoals({
            weeklyStudyHours:      data.weeklyStudyHours      ?? 25,
            weeklyTasksCompleted:  data.weeklyTasksCompleted  ?? 12,
            weeklySubjectsCovered: data.weeklySubjectsCovered ?? 5,
          });
        }
      })
      .catch(() => {});

    // ← new: this week's focus time + unique subjects from focus sessions
    fetch(`${BASE}/focus/weekly`)
      .then((r) => r.json())
      .then((data) => {
        const totalSecs = data.totalSeconds || 0;

        // decimal hours for progress bar math  e.g. 1.75
        setWeeklyFocusHours(parseFloat((totalSecs / 3600).toFixed(2)));

        // readable label for the stat card  e.g. "1h 45m"
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        if (h === 0 && m === 0) setWeeklyFocusLabel("0h");
        else if (h === 0)       setWeeklyFocusLabel(`${m}m`);
        else if (m === 0)       setWeeklyFocusLabel(`${h}h`);
        else                    setWeeklyFocusLabel(`${h}h ${m}m`);

        // unique subjects studied this week
        setWeeklySubjects(data.uniqueSubjects ?? "—");
      })
      .catch(() => {
        setWeeklyFocusHours(0);
        setWeeklyFocusLabel("0h");
        setWeeklySubjects(0);
      });
  }, []);

  const stats = [
    { label: "Study Streak", value: "12",             unit: "days",   icon: "🔥" },
    { label: "Subjects",     value: subjectCount,      unit: "active", icon: "∑"  },
    { label: "This Week",    value: weeklyFocusLabel,  unit: "hours",  icon: "◈"  }, // ← live
    { label: "Tasks Done",   value: taskCount,         unit: "total",  icon: "✦"  },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Lora:wght@400;500;600&display=swap');

        .profile-root {
          font-family: 'Nunito', sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
        }
        .profile-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          pointer-events: none;
          z-index: 0;
        }
        .display-font { font-family: 'Lora', serif; }

        .profile-hero {
          background: #0f172a;
          border-bottom: 1px solid #1e293b;
          position: relative; overflow: hidden; z-index: 1;
        }
        .profile-hero::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 15% 60%, rgba(59,130,246,0.12) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 20%, rgba(20,184,166,0.09) 0%, transparent 50%);
        }
        .hero-grid {
          position: absolute; inset: 0; opacity: 0.04;
          background-image:
            linear-gradient(rgba(148,163,184,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .avatar-ring {
          width: 96px; height: 96px; border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #14b8a6);
          padding: 3px; flex-shrink: 0;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.15), 0 8px 32px rgba(0,0,0,0.35);
        }
        .avatar-inner {
          width: 100%; height: 100%; border-radius: 50%;
          background: #1e293b;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Lora', serif;
          font-size: 36px; color: #60a5fa; overflow: hidden;
        }

        .study-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04);
          position: relative;
        }
        .accent-blue::before {
          content: '';
          position: absolute;
          top: 0; left: 20px; right: 20px; height: 3px;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }
        .accent-teal::before {
          content: '';
          position: absolute;
          top: 0; left: 20px; right: 20px; height: 3px;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(90deg, #14b8a6, #2dd4bf);
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
          display: flex; align-items: center; gap: 14px;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 1px 3px rgba(15,23,42,0.05);
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59,130,246,0.1);
        }
        .stat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }

        .pill {
          font-size: 11px; font-weight: 700; padding: 2px 10px;
          border-radius: 999px; letter-spacing: 0.3px;
        }
        .pill-blue  { background: #dbeafe; color: #1d4ed8; }
        .pill-teal  { background: #ccfbf1; color: #0f766e; }

        .soft-divider { height: 1px; background: #f1f5f9; margin: 14px 0; }

        .info-row {
          display: flex; align-items: center;
          padding: 11px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .info-row:last-child { border-bottom: none; }
        .info-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.8px; color: #94a3b8; width: 130px; flex-shrink: 0;
        }
        .info-value {
          font-size: 13px; font-weight: 600; color: #1e293b;
        }

        .prog-track { width: 100%; height: 5px; border-radius: 999px; background: #e0f2fe; margin-top: 6px; }
        .prog-fill  { height: 5px; border-radius: 999px; background: linear-gradient(90deg, #3b82f6, #14b8a6); transition: width 0.8s ease; }

        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 700;
          color: #64748b; cursor: pointer; background: none; border: none;
          font-family: 'Nunito', sans-serif;
          padding: 6px 12px; border-radius: 8px;
          transition: background 0.15s, color 0.15s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }

        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-1 { animation-delay: 0.08s; }
        .delay-2 { animation-delay: 0.16s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="profile-root">

        {/* Hero Banner */}
        <div className="profile-hero">
          <div className="hero-grid" />
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: "28px 28px 32px", position: "relative", zIndex: 1 }}>

            <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: "24px" }}>
              ← Back
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div className="avatar-ring">
                <div className="avatar-inner">
                  {user?.avatar
                    ? <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : user?.fullName?.charAt(0).toUpperCase() || "?"}
                </div>
              </div>

              <div>
                <h1 className="display-font" style={{ fontSize: "30px", fontWeight: 600, color: "#f1f5f9", margin: 0, letterSpacing: "-0.3px" }}>
                  {user?.fullName || "Student"}
                </h1>
                <p style={{ color: "#64748b", fontSize: "13px", marginTop: "3px", fontWeight: 500 }}>
                  {user?.email}
                </p>
                <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "999px", background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)", fontWeight: 700 }}>
                    ● Online
                  </span>
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "999px", background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", fontWeight: 700 }}>
                    Student
                  </span>
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "999px", background: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.15)", fontWeight: 700 }}>
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 28px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Stats Row */}
            <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {stats.map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon">{s.icon}</div>
                  <div>
                    <div className="display-font" style={{ fontSize: "26px", color: "#3b82f6", lineHeight: 1, fontWeight: 600 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#94a3b8", marginTop: "2px" }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>
                      {s.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

              {/* Account Info */}
              <div className="study-card accent-blue fade-up delay-1" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <h3 className="display-font" style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                    Account Info
                  </h3>
                  <span className="pill pill-blue">Personal</span>
                </div>
                <div className="soft-divider" />

                {[
                  { label: "Full Name", value: user?.fullName || "—" },
                  { label: "Email",     value: user?.email    || "—" },
                  { label: "Role",      value: "Student"            },
                  { label: "Joined",    value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
                  { label: "Status",    value: "Active"             },
                ].map((row) => (
                  <div key={row.label} className="info-row">
                    <span className="info-label">{row.label}</span>
                    <span className="info-value">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Study Goals — all three values now live from DB */}
              <div className="study-card accent-teal fade-up delay-2" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <h3 className="display-font" style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                    Study Goals
                  </h3>
                  <span className="pill pill-teal">Weekly</span>
                </div>
                <div className="soft-divider" />

                {[
                  {
                    label:   "Study Hours",
                    current: weeklyFocusHours,            // ← live from focus sessions
                    goal:    goals.weeklyStudyHours,
                    display: weeklyFocusLabel,            // ← readable label e.g. "1h 45m"
                  },
                  {
                    label:   "Tasks This Week",
                    current: weeklyTasksDone,
                    goal:    goals.weeklyTasksCompleted,
                    display: weeklyTasksDone,
                  },
                  {
                    label:   "Subjects Covered",
                    current: weeklySubjects,              // ← live: unique subjects this week
                    goal:    goals.weeklySubjectsCovered,
                    display: weeklySubjects,
                  },
                ].map((g) => (
                  <div key={g.label} style={{ marginBottom: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>
                        {g.label}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#14b8a6" }}>
                        {g.display} / {g.goal}
                      </span>
                    </div>
                    <div className="prog-track">
                      <div
                        className="prog-fill"
                        style={{
                          width: `${Math.min((Number(g.current) / Number(g.goal)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;