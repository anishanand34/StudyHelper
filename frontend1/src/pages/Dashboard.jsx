import { useState, useEffect } from "react";

const BASE = "http://localhost:8000/api/v1";

const getTasks         = () => fetch(`${BASE}/tasks`).then((r) => r.json());
const getSubjects      = () => fetch(`${BASE}/subjects`).then((r) => r.json());
const toggleTask       = (id) => fetch(`${BASE}/tasks/${id}/toggle`, { method: "PATCH" }).then((r) => r.json());
const getGoals         = () => fetch(`${BASE}/goals`).then((r) => r.json());
const getTodaySessions = () => fetch(`${BASE}/focus`).then((r) => r.json()); // ← new

const subjectColors = [
  { color: "bg-blue-400",   light: "bg-blue-100",   text: "text-blue-600"   },
  { color: "bg-teal-400",   light: "bg-teal-100",   text: "text-teal-600"   },
  { color: "bg-indigo-400", light: "bg-indigo-100", text: "text-indigo-600" },
  { color: "bg-purple-400", light: "bg-purple-100", text: "text-purple-600" },
  { color: "bg-pink-400",   light: "bg-pink-100",   text: "text-pink-600"   },
  { color: "bg-orange-400", light: "bg-orange-100", text: "text-orange-600" },
];

function Dashboard() {
  const [tasks,         setTasks]         = useState([]);
  const [subjects,      setSubjects]      = useState([]);
  const [goals,         setGoals]         = useState({ dailyStudyHours: 6 });
  const [focusSessions, setFocusSessions] = useState([]); // ← new

  useEffect(() => {
    getTasks().then((data)         => setTasks(data));
    getSubjects().then((data)      => setSubjects(data));
    getTodaySessions().then((data) => setFocusSessions(data)); // ← new
    getGoals()
      .then((data) => { if (data && !data.error) setGoals(data); })
      .catch(() => {});
  }, []);

  // ── compute today's study time from real focus sessions ──
  const totalSecondsToday = focusSessions.reduce((acc, s) => acc + s.duration, 0);
  const studyHoursToday   = parseFloat((totalSecondsToday / 3600).toFixed(1));
  const dailyGoal         = goals.dailyStudyHours || 6;
  const goalPercent       = Math.min(Math.round((studyHoursToday / dailyGoal) * 100), 100);

  // ── format seconds into readable string ──
  const formatDuration = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  // ── per-subject session stats derived from focusSessions ──
  const subjectSessionMap = focusSessions.reduce((acc, s) => {
    const key = s.subjectId;
    if (!acc[key]) acc[key] = { totalSeconds: 0, count: 0 };
    acc[key].totalSeconds += s.duration;
    acc[key].count        += 1;
    return acc;
  }, {});

  const handleToggle = async (id) => {
    const updated = await toggleTask(id);
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, done: updated.done } : t)));
  };

  const doneCount = tasks.filter((t) => t.done).length;

  const getDueLabel = (createdAt) => {
    const created = new Date(createdAt);
    const today   = new Date();
    const diff    = Math.floor(
      (new Date(today.toDateString()) - new Date(created.toDateString())) /
        (1000 * 60 * 60 * 24)
    );
    if (diff === 0)  return "Today";
    if (diff === -1) return "Tomorrow";
    return created.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Lora:wght@400;500;600&display=swap');

        .dash-root {
          font-family: 'Nunito', sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
        }
        .dash-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          pointer-events: none;
          z-index: 0;
        }
        .dash-content { position: relative; z-index: 1; }
        .display-font { font-family: 'Lora', serif; }

        .study-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .study-card:hover {
          box-shadow: 0 4px 20px rgba(15,23,42,0.1);
          transform: translateY(-2px);
        }
        .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 1px 3px rgba(15,23,42,0.05);
        }
        .task-row {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          transition: background 0.15s, border-color 0.15s;
          cursor: pointer;
        }
        .task-row:hover { background: #eff6ff; border-color: #bfdbfe; }

        .study-check {
          width: 20px; height: 20px;
          border-radius: 6px;
          border: 2px solid #93c5fd;
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s, border-color 0.15s;
        }
        .study-check.checked { background: #3b82f6; border-color: #3b82f6; }

        .prog-track { height: 6px; border-radius: 999px; overflow: hidden; }
        .prog-fill  { height: 100%; border-radius: 999px; transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1); }

        .pill { font-size: 11px; font-weight: 600; padding: 2px 10px; border-radius: 999px; letter-spacing: 0.3px; }
        .pill-blue   { background: #dbeafe; color: #1d4ed8; }
        .pill-teal   { background: #ccfbf1; color: #0f766e; }
        .pill-slate  { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
        .pill-green  { background: #dcfce7; color: #15803d; }
        .pill-orange { background: #ffedd5; color: #c2410c; }

        .soft-divider { height: 1px; background: #f1f5f9; margin: 16px 0; }

        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-1 { animation-delay: 0.08s; }
        .delay-2 { animation-delay: 0.16s; }
        .delay-3 { animation-delay: 0.24s; }
        .delay-4 { animation-delay: 0.32s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .accent-top { position: relative; }
        .accent-top::before {
          content: '';
          position: absolute;
          top: 0; left: 20px; right: 20px;
          height: 3px;
          border-radius: 0 0 4px 4px;
        }
        .accent-blue::before  { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
        .accent-teal::before  { background: linear-gradient(90deg, #14b8a6, #2dd4bf); }

        .greeting-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          border-radius: 999px; padding: 4px 14px;
          font-size: 12px; font-weight: 600; color: #1d4ed8; letter-spacing: 0.3px;
        }

        /* subject session row inside today's progress */
        .subject-session-row {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 10px; border-radius: 8px;
          background: #f8fafc; border: 1px solid #f1f5f9;
          margin-top: 6px;
          font-size: 11px; font-weight: 600; color: #64748b;
        }
      `}</style>

      <div className="dash-root">
        <div className="dash-content max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="fade-up mb-8">
            <div className="greeting-badge mb-4">
              <span>📚</span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric",
              })}
            </div>
            <h1 className="display-font text-4xl font-semibold"
              style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
              Study Dashboard
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
              Track your progress, manage tasks, and stay focused.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 fade-up delay-1">
            {[
              {
                label: "Subjects",
                value: subjects.length,
                sub:   "active today",
                icon:  "📖",
                pill:  "pill-blue",
              },
              {
                // ← now live: real study time from focus sessions
                label: "Study Time",
                value: (() => {
                if (totalSecondsToday === 0) return "0h";
                const h = Math.floor(totalSecondsToday / 3600);
                const m = Math.floor((totalSecondsToday % 3600) / 60);
                if (h === 0) return `${m}m`;
                if (m === 0) return `${h}h`;
                return `${h}h ${m}m`;
                })(),
                sub:   "logged today",
                icon:  "⏱️",
                pill:  "pill-teal",
              },
              {
                label: "Tasks Done",
                value: `${doneCount}/${tasks.length}`,
                sub:   "completed",
                icon:  "✅",
                pill:  "pill-green",
              },
            ].map((s) => (
              <div key={s.label} className="stat-card p-5 flex items-center gap-4">
                <div className="text-3xl">{s.icon}</div>
                <div>
                  <div className="display-font text-3xl font-semibold"
                    style={{ color: "#0f172a", lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div className="text-xs font-semibold mt-0.5 uppercase tracking-wide"
                    style={{ color: "#94a3b8" }}>
                    {s.label}
                  </div>
                  <span className={`pill ${s.pill} mt-1.5 inline-block`}>
                    {s.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* Today's Progress */}
            <div className="study-card accent-top accent-blue p-6 fade-up delay-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="display-font text-xl font-semibold" style={{ color: "#0f172a" }}>
                  Today's Progress
                </h3>
                <span className="pill pill-blue">Daily</span>
              </div>
              <div className="soft-divider" />
  {subjects.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-8 gap-2">
    <span style={{ fontSize: "28px" }}>📖</span>
    <p className="text-sm font-semibold" style={{ color: "#94a3b8" }}>No subjects yet</p>
    <p className="text-xs" style={{ color: "#cbd5e1" }}>Add subjects from the Subjects page</p>
  </div>
) : (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    {subjects.map((s, i) => {
      const c           = subjectColors[i % subjectColors.length];
      const sessionData = subjectSessionMap[s._id] || { totalSeconds: 0, count: 0 };
      const hasSession  = sessionData.count > 0;

      // hex color map for background tints
      const bgTints = [
        { bg: "#eff6ff", border: "#bfdbfe", dot: "#3b82f6" },
        { bg: "#f0fdfa", border: "#99f6e4", dot: "#14b8a6" },
        { bg: "#f5f3ff", border: "#c4b5fd", dot: "#8b5cf6" },
        { bg: "#f0fdf4", border: "#86efac", dot: "#22c55e" },
        { bg: "#fff1f2", border: "#fecdd3", dot: "#f43f5e" },
        { bg: "#fff7ed", border: "#fed7aa", dot: "#f97316" },
      ];
      const tint = bgTints[i % bgTints.length];

      return (
        <div
          key={s._id}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 14px", borderRadius: "12px",
            background: hasSession ? tint.bg : "#f8fafc",
            border: `1px solid ${hasSession ? tint.border : "#e2e8f0"}`,
            transition: "background 0.2s, border-color 0.2s",
          }}
        >
          {/* left: dot + name */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: hasSession ? tint.dot : "#cbd5e1",
              flexShrink: 0,
              boxShadow: hasSession ? `0 0 0 3px ${tint.border}` : "none",
            }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
              {s.name}
            </span>
          </div>

          {/* right: session count + time OR idle label */}
          {hasSession ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                fontSize: "11px", fontWeight: 700,
                color: tint.dot,
              }}>
                {sessionData.count} session{sessionData.count !== 1 ? "s" : ""}
              </span>
              <span style={{
                fontSize: "11px", fontWeight: 700,
                padding: "2px 9px", borderRadius: "999px",
                background: "#ffffff",
                color: "#475569",
                border: `1px solid ${tint.border}`,
              }}>
                {formatDuration(sessionData.totalSeconds)}
              </span>
            </div>
          ) : (
            <span style={{
              fontSize: "10px", fontWeight: 700,
              color: "#cbd5e1", letterSpacing: "0.3px",
            }}>
              No sessions yet
            </span>
          )}
        </div>
      );
    })}
  </div>
)}



              <div className="soft-divider" />
<div className="flex justify-between text-xs font-semibold mb-2"
  style={{ color: "#64748b" }}>
  <span>Overall goal</span>
  {/* ← now shows hours and minutes for both current and goal */}
  <span className="text-blue-500">
    {(() => {
      const h = Math.floor(totalSecondsToday / 3600);
      const m = Math.floor((totalSecondsToday % 3600) / 60);
      const goalMins = (dailyGoal * 60);
      const goalH = Math.floor(goalMins / 60);
      const goalM = goalMins % 60;
      const currentStr = h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
      const goalStr    = goalM === 0 ? `${goalH}h` : `${goalH}h ${goalM}m`;
      return `${currentStr} / ${goalStr}`;
    })()}
  </span>
</div>
<div className="prog-track bg-blue-100">
  <div
    className="prog-fill bg-gradient-to-r from-blue-400 to-blue-500"
    style={{ width: `${goalPercent}%` }}
  />
</div>

<div className="flex justify-between items-center mt-2">
  {/* <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>
    {totalSecondsToday > 0
      ? `Total: ${formatDuration(totalSecondsToday)}`
      : "No focus time logged yet"}
  </span> */}
  <span className="text-xs font-semibold" style={{ color: "#94a3b8" }}>
    {goalPercent}% of daily goal
  </span>
</div>
</div>


            {/* Upcoming Tasks */}
            <div className="study-card accent-top accent-teal p-6 fade-up delay-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="display-font text-xl font-semibold" style={{ color: "#0f172a" }}>
                  Upcoming Tasks
                </h3>
                <span className="pill pill-teal">
                  {tasks.filter((t) => !t.done).length} left
                </span>
              </div>
              <div className="soft-divider" />

              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <span style={{ fontSize: "28px" }}>📋</span>
                  <p className="text-sm font-semibold" style={{ color: "#94a3b8" }}>No tasks yet</p>
                  <p className="text-xs" style={{ color: "#cbd5e1" }}>Add tasks from the Schedule page</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {tasks.map((task) => (
                    <li
                      key={task._id}
                      className={`task-row flex items-center gap-3 px-4 py-3 ${task.done ? "opacity-50" : ""}`}
                      onClick={() => handleToggle(task._id)}
                    >
                      <div className={`study-check ${task.done ? "checked" : ""}`}>
                        {task.done && (
                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                            <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8"
                              strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="flex-1 text-sm font-medium" style={{
                        color: task.done ? "#94a3b8" : "#1e293b",
                        textDecoration: task.done ? "line-through" : "none",
                        transition: "color 0.15s",
                      }}>
                        {task.text}
                      </span>
                      <span className={`pill ${
                        getDueLabel(task.createdAt) === "Today"     ? "pill-orange" :
                        getDueLabel(task.createdAt) === "Tomorrow"  ? "pill-blue"   : "pill-slate"
                      }`}>
                        {getDueLabel(task.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="soft-divider" />
              <div className="flex justify-between text-xs font-semibold mb-2" style={{ color: "#64748b" }}>
                <span>Completion</span>
                <span className="text-teal-600">{doneCount}/{tasks.length} done</span>
              </div>
              <div className="prog-track bg-teal-100">
                <div
                  className="prog-fill bg-gradient-to-r from-teal-400 to-teal-500"
                  style={{ width: tasks.length > 0 ? `${(doneCount / tasks.length) * 100}%` : "0%" }}
                />
              </div>
              <p className="text-xs mt-2 text-center" style={{ color: "#94a3b8" }}>
                Click any task to mark it complete
              </p>
            </div>

          </div>

          {/* Focus Tip */}
          <div
            className="study-card fade-up delay-4 mt-5 p-5 flex items-center gap-4"
            style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f0fdfa 100%)", border: "1px solid #bfdbfe" }}
          >
            <div className="text-3xl">💡</div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1e3a5f" }}>Focus Tip of the Day</p>
              <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
                Try the <strong>Pomodoro technique</strong> — 25 minutes focused
                study, 5 minutes break. Your brain retains more when it rests regularly.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;