import { useState, useEffect } from "react";

const BASE = "http://localhost:8000/api/v1"; // change port to match yours

const getTasks = () => fetch(`${BASE}/tasks`).then((r) => r.json());

const addTask = (text, time) =>
  fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, time }),
  }).then((r) => r.json());

const toggleTask = (id) =>
  fetch(`${BASE}/tasks/${id}/toggle`, { method: "PATCH" }).then((r) => r.json());

const deleteTask = (id) =>
  fetch(`${BASE}/tasks/${id}`, { method: "DELETE" }).then((r) => r.json());

function Schedule() {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from DB on mount
  useEffect(() => {
    getTasks().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  const handleAdd = async () => {
    if (!task.trim()) return;
    const formattedTime = time
      ? new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Anytime";
    const newTask = await addTask(task, formattedTime);
    setTasks((prev) => [...prev, newTask]);
    setTask("");
    setTime("");
  };

  const handleToggle = async (id) => {
    const updated = await toggleTask(id);
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, done: updated.done } : t))
    );
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Lora:wght@400;500;600&display=swap');

        .sch-root {
          font-family: 'Nunito', sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
        }

        .sch-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          pointer-events: none;
          z-index: 0;
        }

        .sch-content { position: relative; z-index: 1; }
        .display-font { font-family: 'Lora', serif; }

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

        .sch-input {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 11px 14px;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .sch-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
          background: #ffffff;
        }
        .sch-input::placeholder { color: #94a3b8; }

        .add-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 11px 24px;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
          white-space: nowrap;
        }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(59,130,246,0.35); }
        .add-btn:active { transform: translateY(0); }

        .task-row {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
          animation: slideIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
        .task-row:hover {
          background: #eff6ff;
          border-color: #bfdbfe;
          transform: translateX(2px);
        }
        .task-row.done-row { opacity: 0.55; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .study-check {
          width: 20px; height: 20px;
          border-radius: 6px;
          border: 2px solid #93c5fd;
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .study-check.checked { background: #3b82f6; border-color: #3b82f6; }

        .del-btn {
          background: none; border: none; cursor: pointer;
          color: #cbd5e1; font-size: 18px;
          transition: color 0.15s; padding: 0 2px; line-height: 1;
          flex-shrink: 0;
        }
        .del-btn:hover { color: #ef4444; }

        .pill {
          font-size: 11px; font-weight: 700; padding: 2px 10px;
          border-radius: 999px; letter-spacing: 0.3px; white-space: nowrap;
        }
        .pill-blue   { background: #dbeafe; color: #1d4ed8; }
        .pill-teal   { background: #ccfbf1; color: #0f766e; }
        .pill-slate  { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

        .prog-track { height: 5px; border-radius: 999px; background: #e0f2fe; }
        .prog-fill  { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #3b82f6, #14b8a6); transition: width 0.5s ease; }

        .soft-divider { height: 1px; background: #f1f5f9; margin: 14px 0; }

        .greeting-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          border-radius: 999px; padding: 4px 14px;
          font-size: 11px; font-weight: 700; color: #1d4ed8; letter-spacing: 0.5px;
        }

        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="sch-root">
        <div className="sch-content max-w-2xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="fade-up mb-8">
            <div className="greeting-badge mb-4">
              <span>📅</span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
            <h1
              className="display-font text-4xl font-semibold"
              style={{ color: "#0f172a", letterSpacing: "-0.5px" }}
            >
              Study Schedule
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
              Plan your day, track your tasks, stay on top.
            </p>
          </div>

          {/* Add Task Card */}
          <div className="study-card accent-blue p-6 mb-5 fade-up delay-1">
            <div className="flex items-center justify-between mb-1">
              <h3
                className="display-font text-xl font-semibold"
                style={{ color: "#0f172a" }}
              >
                Add New Task
              </h3>
              <span className="pill pill-blue">{tasks.length} tasks</span>
            </div>
            <div className="soft-divider" />

            <div className="flex gap-3 flex-wrap">
              <input
                className="sch-input flex-1"
                style={{ minWidth: "180px" }}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Enter study task..."
              />
              <input
                className="sch-input"
                style={{ width: "130px" }}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <button className="add-btn" onClick={handleAdd}>
                + Add
              </button>
            </div>
            <p
              className="text-xs mt-3 font-semibold"
              style={{ color: "#94a3b8" }}
            >
              Press Enter to add quickly
            </p>
          </div>

          {/* Task List Card */}
          <div className="study-card accent-teal p-6 fade-up delay-2">
            <div className="flex items-center justify-between mb-1">
              <h3
                className="display-font text-xl font-semibold"
                style={{ color: "#0f172a" }}
              >
                Today's Tasks
              </h3>
              <span className="pill pill-teal">
                {doneCount} / {tasks.length} done
              </span>
            </div>
            <div className="soft-divider" />

            {/* Progress bar */}
            {tasks.length > 0 && (
              <div className="mb-5">
                <div
                  className="flex justify-between text-xs font-semibold mb-1.5"
                  style={{ color: "#64748b" }}
                >
                  <span>Completion</span>
                  <span style={{ color: "#14b8a6" }}>{Math.round(progress)}%</span>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <span style={{ fontSize: "32px" }}>⏳</span>
                <p className="text-sm font-semibold" style={{ color: "#94a3b8" }}>
                  Loading tasks...
                </p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <span style={{ fontSize: "32px" }}>📋</span>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#94a3b8" }}
                >
                  No tasks yet
                </p>
                <p className="text-xs" style={{ color: "#cbd5e1" }}>
                  Add one above to get started
                </p>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {tasks.map((t) => (
                  <div
                    key={t._id}
                    className={`task-row ${t.done ? "done-row" : ""}`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`study-check ${t.done ? "checked" : ""}`}
                      onClick={() => handleToggle(t._id)}
                    >
                      {t.done && (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path
                            d="M1 4.5L4 7.5L10 1"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Text */}
                    <span
                      className="flex-1 text-sm font-semibold"
                      style={{
                        color: t.done ? "#94a3b8" : "#1e293b",
                        textDecoration: t.done ? "line-through" : "none",
                        transition: "color 0.15s",
                      }}
                    >
                      {t.text}
                    </span>

                    {/* Time badge */}
                    <span className="pill pill-slate">{t.time}</span>

                    {/* Delete */}
                    <button
                      className="del-btn"
                      onClick={() => handleDelete(t._id)}
                      title="Remove task"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tasks.length > 0 && (
              <>
                <div className="soft-divider" />
                <p
                  className="text-xs text-center font-semibold"
                  style={{ color: "#94a3b8" }}
                >
                  Click a task to mark complete · × to remove
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default Schedule;