import { useState, useEffect, useRef } from "react";

const BASE = "http://localhost:8000/api/v1";

const getSubjects      = () => fetch(`${BASE}/subjects`).then((r) => r.json());
const getTodaySessions = () => fetch(`${BASE}/focus`).then((r) => r.json());
const saveSession      = (body) =>
  fetch(`${BASE}/focus`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  }).then((r) => r.json());

function FocusMode() {
  const [subjects,    setSubjects]    = useState([]);
  const [selectedId,  setSelectedId]  = useState("");
  const [isRunning,   setIsRunning]   = useState(false);
  const [isPaused,    setIsPaused]    = useState(false);
  const [seconds,     setSeconds]     = useState(0);
  const [sessions,    setSessions]    = useState([]);
  const [saving,      setSaving]      = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const intervalRef   = useRef(null);
  const warningTimer  = useRef(null);

  useEffect(() => {
    getSubjects().then((data)      => setSubjects(data));
    getTodaySessions().then((data) => setSessions(data));
  }, []);

  // ── block browser tab close / refresh while running ──
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isRunning) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isRunning]);

  // ── block browser back button while running ──
  useEffect(() => {
    if (!isRunning) return;
    window.history.pushState(null, "", window.location.href);
    const handlePop = () => {
      window.history.pushState(null, "", window.location.href);
      triggerWarning();
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [isRunning]);

  // ── intercept navbar link clicks while running ──
  useEffect(() => {
    if (!isRunning) return;

const handleCapture = (e) => {
  // block navbar anchor link clicks
  const anchor = e.target.closest("a[href]");
  if (anchor) {
    const href = anchor.getAttribute("href");
    if (href && href !== window.location.pathname) {
      e.preventDefault();
      e.stopImmediatePropagation();
      triggerWarning();
      return;
    }
  }

  // block the account dropdown button in the navbar
  // it has class "account-btn" from Navbar.jsx
  const accountBtn = e.target.closest(".account-btn");
  if (accountBtn) {
    e.preventDefault();
    e.stopImmediatePropagation();
    triggerWarning();
    return;
  }
};

    document.addEventListener("click", handleCapture, true);
    return () => document.removeEventListener("click", handleCapture, true);
  }, [isRunning]);

  const triggerWarning = () => {
    setShowWarning(true);
    clearTimeout(warningTimer.current);
    warningTimer.current = setTimeout(() => setShowWarning(false), 3000);
  };

  // ── tick ──
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  const selectedSubject = subjects.find((s) => s._id === selectedId);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0)
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const formatDuration = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const handleStart = () => {
    if (!selectedId) return;
    setIsRunning(true);
    setIsPaused(false);
    setSeconds(0);
  };

  const handlePause  = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const handleStop = async () => {
    if (seconds < 1 || !selectedSubject) {
      setIsRunning(false);
      setIsPaused(false);
      setSeconds(0);
      return;
    }
    setSaving(true);
    try {
      const saved = await saveSession({
        subjectId:   selectedSubject._id,
        subjectName: selectedSubject.name,
        subjectIcon: selectedSubject.icon,
        duration:    seconds,
      });
      if (saved && !saved.error) {
        const fresh = await getTodaySessions();
        setSessions(fresh);
      }
    } catch (err) {
      console.error("Failed to save session:", err);
    } finally {
      setSaving(false);
      setIsRunning(false);
      setIsPaused(false);
      setSeconds(0);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
  };

  const radius        = 88;
  const circumference = 2 * Math.PI * radius;
  const maxDisplay    = 3600;
  const progress      = Math.min(seconds / maxDisplay, 1);
  const strokeOffset  = circumference - progress * circumference;

  const colors = [
    "#3b82f6", "#14b8a6", "#8b5cf6", "#22c55e",
    "#f97316", "#ec4899", "#0ea5e9", "#eab308",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Lora:wght@400;500;600&display=swap');

        .focus-root {
          font-family: 'Nunito', sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
        }
        .focus-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          pointer-events: none;
          z-index: 0;
        }
        .focus-content { position: relative; z-index: 1; }
        .display-font  { font-family: 'Lora', serif; }

        .focus-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04);
          position: relative;
        }

        /* ── Warning toast ── */
        .focus-warning-toast {
          position: fixed;
          top: 76px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
          background: #1e293b;
          color: #f8fafc;
          padding: 11px 20px;
          border-radius: 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 32px rgba(15,23,42,0.25);
          border: 1px solid #334155;
          white-space: nowrap;
          animation: toastIn 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── Active focus indicator strip ── */
        .focus-active-strip {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 16px; border-radius: 12px;
          background: #f0f9ff;
          border: 1px solid #bfdbfe;
          margin-bottom: 20px;
          font-size: 12px; font-weight: 700;
        }

        .subject-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 13px; font-weight: 600; color: #475569;
          transition: border-color 0.15s, background 0.15s, color 0.15s, transform 0.15s;
        }
        .subject-pill:hover {
          border-color: #93c5fd; background: #eff6ff; color: #1d4ed8;
          transform: translateY(-1px);
        }
        .subject-pill.selected {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }

        .ctrl-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 28px; border-radius: 14px; border: none;
          font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: transform 0.15s, box-shadow 0.2s, opacity 0.15s;
        }
        .ctrl-btn:hover  { transform: translateY(-2px); }
        .ctrl-btn:active { transform: translateY(0); }
        .ctrl-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        .btn-start  { background: linear-gradient(135deg, #3b82f6, #2563eb); color: #ffffff; box-shadow: 0 4px 16px rgba(59,130,246,0.35); flex: 1; }
        .btn-pause  { background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; box-shadow: 0 4px 16px rgba(245,158,11,0.3);  flex: 1; }
        .btn-resume { background: linear-gradient(135deg, #22c55e, #16a34a); color: #ffffff; box-shadow: 0 4px 16px rgba(34,197,94,0.3);   flex: 1; }
        .btn-stop   { background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; box-shadow: 0 4px 16px rgba(239,68,68,0.3);   flex: 1; }
        .btn-reset  { background: #f1f5f9; color: #64748b; border: 1.5px solid #e2e8f0 !important; box-shadow: none; padding: 13px 20px; }
        .btn-reset:hover { background: #e2e8f0; box-shadow: none !important; }

        .session-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 10px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          animation: slideIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .soft-divider { height: 1px; background: #f1f5f9; margin: 16px 0; }

        .greeting-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          border-radius: 999px; padding: 4px 14px;
          font-size: 11px; font-weight: 700; color: #1d4ed8; letter-spacing: 0.5px;
        }

        .fade-up  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-1  { animation-delay: 0.1s; }
        .delay-2  { animation-delay: 0.2s; }
        .delay-3  { animation-delay: 0.3s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes ringPulse {
          0%,100% { filter: drop-shadow(0 0 6px rgba(59,130,246,0.4)); }
          50%      { filter: drop-shadow(0 0 16px rgba(59,130,246,0.7)); }
        }
        .ring-running { animation: ringPulse 2s ease-in-out infinite; }
        .ring-paused  { filter: drop-shadow(0 0 6px rgba(245,158,11,0.4)); }
      `}</style>

      {/* ── Warning toast — only shows when nav is attempted during session ── */}
      {showWarning && (
        <div className="focus-warning-toast">
          <span>🔒</span>
          Stop & save your session before navigating away
        </div>
      )}

      <div className="focus-root">
        <div className="focus-content max-w-3xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="fade-up mb-8">
            <div className="greeting-badge mb-4">
              <span>⏱</span> Focus Mode
            </div>
            <h1 className="display-font text-4xl font-semibold"
              style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
              Deep Focus
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
              Select a subject, start the timer, and stay in the zone.
            </p>
          </div>

          {/* Subject Selector */}
          <div className="focus-card p-6 mb-5 fade-up delay-1">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <h3 className="display-font text-xl font-semibold" style={{ color: "#0f172a" }}>
                Choose Subject
              </h3>
              {selectedSubject && (
                <span style={{
                  fontSize: "11px", padding: "2px 10px", borderRadius: "999px",
                  background: "#dbeafe", color: "#1d4ed8", border: "1px solid #bfdbfe", fontWeight: 700,
                }}>
                  {selectedSubject.name}
                </span>
              )}
            </div>
            <div className="soft-divider" />

            {subjects.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <span style={{ fontSize: "28px" }}>📚</span>
                <p className="text-sm font-semibold mt-2" style={{ color: "#94a3b8" }}>
                  No subjects yet — add some from the Subjects page
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {subjects.map((s) => (
                  <button
                    key={s._id}
                    className={`subject-pill ${selectedId === s._id ? "selected" : ""}`}
                    onClick={() => !isRunning && setSelectedId(s._id)}
                    disabled={isRunning}
                    style={{ opacity: isRunning && selectedId !== s._id ? 0.5 : 1 }}
                  >
                    <span style={{ fontSize: "16px" }}>{s.icon}</span>
                    {s.name}
                  </button>
                ))}
              </div>
            )}

            {!selectedId && !isRunning && subjects.length > 0 && (
              <p style={{ marginTop: "12px", fontSize: "11px", fontWeight: 700, color: "#f59e0b" }}>
                ⚠ Pick a subject before starting
              </p>
            )}
          </div>

          {/* Stopwatch */}
          <div className="focus-card p-8 mb-5 fade-up delay-2" style={{ textAlign: "center" }}>

            {/* Active focus strip */}
            {isRunning && (
              <div className="focus-active-strip">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1d4ed8" }}>
                  <span>🔒</span>
                  <span>Focus locked — navbar disabled until you stop & save</span>
                </div>
                <span style={{
                  fontSize: "10px", padding: "2px 8px", borderRadius: "999px",
                  background: "#dbeafe", color: "#1d4ed8", border: "1px solid #bfdbfe", fontWeight: 700,
                }}>
                  ACTIVE
                </span>
              </div>
            )}

            {/* Ring */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
              <div style={{ position: "relative", width: "220px", height: "220px" }}>
                <svg
                  width="220" height="220" viewBox="0 0 220 220"
                  className={isRunning && !isPaused ? "ring-running" : isPaused ? "ring-paused" : ""}
                >
                  <circle cx="110" cy="110" r={radius} fill="none" stroke="#e0f2fe" strokeWidth="10" />
                  <circle
                    cx="110" cy="110" r={radius}
                    fill="none"
                    stroke={isPaused ? "#f59e0b" : isRunning ? "#3b82f6" : "#cbd5e1"}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    transform="rotate(-90 110 110)"
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
                  />
                  {selectedSubject && (
                    <text x="110" y="90" textAnchor="middle" dominantBaseline="central" fontSize="28">
                      {selectedSubject.icon}
                    </text>
                  )}
                </svg>

                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  marginTop: selectedSubject ? "20px" : "0",
                }}>
                  <div className="display-font" style={{
                    fontSize: seconds >= 3600 ? "28px" : "36px",
                    fontWeight: 600,
                    color: isPaused ? "#d97706" : isRunning ? "#1d4ed8" : "#0f172a",
                    letterSpacing: "-1px", lineHeight: 1,
                    transition: "color 0.3s ease",
                  }}>
                    {formatTime(seconds)}
                  </div>
                  <div style={{
                    fontSize: "11px", fontWeight: 700, marginTop: "6px",
                    color: isPaused ? "#f59e0b" : isRunning ? "#3b82f6" : "#94a3b8",
                    textTransform: "uppercase", letterSpacing: "1.5px",
                  }}>
                    {saving ? "Saving..." : isPaused ? "Paused" : isRunning ? "Focusing" : "Ready"}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls — always fully interactive */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              {!isRunning && (
                <button
                  className="ctrl-btn btn-start"
                  onClick={handleStart}
                  disabled={!selectedId || saving}
                >
                  ▶ Start
                </button>
              )}
              {isRunning && !isPaused && (
                <button className="ctrl-btn btn-pause" onClick={handlePause}>
                  ⏸ Pause
                </button>
              )}
              {isRunning && isPaused && (
                <button className="ctrl-btn btn-resume" onClick={handleResume}>
                  ▶ Resume
                </button>
              )}
              {isRunning && (
                <button
                  className="ctrl-btn btn-stop"
                  onClick={handleStop}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "⏹ Stop & Save"}
                </button>
              )}
              {!isRunning && seconds > 0 && (
                <button className="ctrl-btn btn-reset" onClick={handleReset}>
                  ↺ Reset
                </button>
              )}
            </div>

            {isRunning && selectedSubject && (
              <p style={{ marginTop: "16px", fontSize: "12px", fontWeight: 600, color: "#64748b" }}>
                Studying <span style={{ color: "#1d4ed8" }}>{selectedSubject.name}</span> — stay focused!
              </p>
            )}
          </div>

          {/* Session History */}
          {sessions.length > 0 && (
            <div className="focus-card p-6 fade-up delay-3">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <h3 className="display-font text-xl font-semibold" style={{ color: "#0f172a" }}>
                  Today's Sessions
                </h3>
                <span style={{
                  fontSize: "11px", padding: "2px 10px", borderRadius: "999px",
                  background: "#ccfbf1", color: "#0f766e", fontWeight: 700,
                }}>
                  {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="soft-divider" />

              <div style={{
                background: "#f0f9ff", border: "1px solid #bfdbfe",
                borderRadius: "12px", padding: "12px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "12px",
              }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>
                  Total focus time today
                </span>
                <span className="display-font" style={{ fontSize: "18px", fontWeight: 600, color: "#1d4ed8" }}>
                  {formatDuration(sessions.reduce((acc, s) => acc + s.duration, 0))}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {sessions.map((s, i) => (
                  <div key={s._id} className="session-row">
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: `${colors[i % colors.length]}18`,
                      border: `1px solid ${colors[i % colors.length]}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", flexShrink: 0,
                    }}>
                      {s.subjectIcon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                        {s.subjectName}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginTop: "2px" }}>
                        {new Date(s.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div style={{
                      fontSize: "13px", fontWeight: 700,
                      color: colors[i % colors.length],
                      background: `${colors[i % colors.length]}14`,
                      padding: "3px 10px", borderRadius: "999px",
                      border: `1px solid ${colors[i % colors.length]}30`,
                    }}>
                      {formatDuration(s.duration)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default FocusMode;