import { useState } from "react";

const defaultTasks = [
  { text: "Math Assignment", time: "9:00 AM", done: false },
  { text: "DSA Practice", time: "11:00 AM", done: false },
  { text: "OS Revision", time: "2:00 PM", done: true },
];

function Schedule() {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [tasks, setTasks] = useState(defaultTasks);

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, { text: task, time: time || "Anytime", done: false }]);
      setTask("");
      setTime("");
    }
  };

  const toggleDone = (i) =>
    setTasks(tasks.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));

  const deleteTask = (i) =>
    setTasks(tasks.filter((_, idx) => idx !== i));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500&display=swap');

        .sch-root { font-family: 'Montserrat', sans-serif; background: #f7f4ee; min-height: 100vh; }
        .sch-title { font-family: 'Cormorant Garamond', serif; }

        .card {
          background: rgba(255,253,247,0.92);
          border: 1px solid rgba(184,151,90,0.22);
          box-shadow: 0 8px 32px rgba(100,80,40,0.08), 0 2px 8px rgba(100,80,40,0.04), inset 0 1px 0 rgba(255,255,255,0.8);
          border-radius: 18px;
        }
        .card-top-line {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #b8975a, transparent);
          border-radius: 18px 18px 0 0;
        }

        .sch-input {
          background: #f9f6ef;
          border: 1px solid rgba(184,151,90,0.3);
          border-radius: 12px;
          padding: 12px 16px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          color: #2c2416;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .sch-input:focus {
          border-color: #b8975a;
          box-shadow: 0 0 0 3px rgba(184,151,90,0.13);
          background: #fffef9;
        }
        .sch-input::placeholder { color: #b8a07a; }

        .add-btn {
          background: linear-gradient(135deg, #b8975a, #8a6d38);
          color: #fff8ee;
          border: none;
          border-radius: 12px;
          padding: 12px 28px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .add-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(139,107,52,0.28);
        }
        .add-btn:active { transform: translateY(0); }

        .task-item {
          background: #f9f6ef;
          border: 1px solid rgba(184,151,90,0.18);
          border-radius: 13px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          animation: slideIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }
        .task-item:hover {
          background: #f3ede0;
          border-color: rgba(184,151,90,0.38);
          transform: translateX(3px);
          box-shadow: 0 4px 16px rgba(100,80,40,0.07);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .checkbox {
          width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0; cursor: pointer;
          border: 1.5px solid #b8975a; background: transparent;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .checkbox.checked { background: linear-gradient(135deg, #b8975a, #8a6d38); border-color: transparent; }

        .del-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(184,151,90,0.4); font-size: 16px;
          transition: color 0.2s; padding: 0 4px; line-height: 1;
        }
        .del-btn:hover { color: #c0392b; }

        .badge {
          font-size: 10px; padding: 2px 8px; border-radius: 20px;
          font-family: 'Montserrat', sans-serif; letter-spacing: 1px;
          background: rgba(184,151,90,0.12); color: #8a6d38;
          border: 1px solid rgba(184,151,90,0.25);
          white-space: nowrap;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4c4a0, transparent);
          margin: 16px 0;
        }

        .ornament {
          font-family: 'Cormorant Garamond', serif;
          color: #b8975a; opacity: 0.5; letter-spacing: 6px; font-size: 14px;
        }

        .fade-in { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-in-delay { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .empty-state {
          text-align: center; padding: 40px 0;
          color: #c4b08a; font-size: 12px; letter-spacing: 2px;
        }

        .progress-bar {
          height: 4px; border-radius: 4px;
          background: rgba(184,151,90,0.15); margin-top: 10px;
        }
        .progress-fill {
          height: 100%; border-radius: 4px;
          background: linear-gradient(90deg, #b8975a, #8a6d38);
          transition: width 0.5s ease;
        }
      `}</style>

      <div className="sch-root">

        {/* Bg glows */}
        <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(184,151,90,0.07) 0%, transparent 70%)" }} />
        <div className="fixed bottom-0 left-0 w-48 h-48 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,107,52,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-2xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="fade-in mb-10">
            <div className="ornament mb-2">✦ ✦ ✦</div>
            <h1 className="sch-title text-5xl font-light" style={{ color: "#2c2416", letterSpacing: "1px" }}>
              Study Schedule
            </h1>
            <div style={{ width: "56px", height: "1px", background: "linear-gradient(90deg, #b8975a, transparent)", marginTop: "12px" }} />
            <p className="mt-2 text-xs uppercase tracking-widest" style={{ color: "#9a8060", letterSpacing: "3px" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Add Task Card */}
          <div className="card relative p-7 mb-5 fade-in">
            <div className="card-top-line" />
            <div className="flex items-center justify-between mb-1">
              <h3 className="sch-title text-2xl font-light" style={{ color: "#2c2416" }}>Add New Task</h3>
              <span className="badge">{tasks.length} tasks</span>
            </div>
            <div className="divider" />

            <div className="flex gap-3 flex-wrap">
              <input
                className="sch-input flex-1"
                style={{ minWidth: "180px" }}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Enter study task..."
              />
              <input
                className="sch-input"
                style={{ width: "130px" }}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <button className="add-btn" onClick={addTask}>
                Add ✦
              </button>
            </div>
            <p className="text-xs mt-3" style={{ color: "#b8a07a", letterSpacing: "0.5px" }}>
              Press Enter to add quickly
            </p>
          </div>

          {/* Task List Card */}
          <div className="card relative p-7 fade-in-delay">
            <div className="card-top-line" />

            <div className="flex items-center justify-between mb-1">
              <h3 className="sch-title text-2xl font-light" style={{ color: "#2c2416" }}>Today's Tasks</h3>
              <span className="badge">
                {tasks.filter(t => t.done).length} / {tasks.length} done
              </span>
            </div>
            <div className="divider" />

            {/* Progress bar */}
            {tasks.length > 0 && (
              <div className="progress-bar mb-5">
                <div
                  className="progress-fill"
                  style={{ width: `${(tasks.filter(t => t.done).length / tasks.length) * 100}%` }}
                />
              </div>
            )}

            {tasks.length === 0 ? (
              <div className="empty-state">
                No tasks yet — add one above ✦
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {tasks.map((t, i) => (
                  <div key={i} className="task-item">

                    {/* Checkbox */}
                    <div className={`checkbox ${t.done ? "checked" : ""}`} onClick={() => toggleDone(i)}>
                      {t.done && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* Text */}
                    <span
                      className="flex-1 text-sm"
                      style={{
                        color: t.done ? "#b8a080" : "#2c2416",
                        textDecoration: t.done ? "line-through" : "none",
                        fontFamily: "'Montserrat', sans-serif",
                        transition: "color 0.2s",
                      }}
                    >
                      {t.text}
                    </span>

                    {/* Time badge */}
                    <span className="badge">{t.time}</span>

                    {/* Delete */}
                    <button className="del-btn" onClick={() => deleteTask(i)} title="Remove task">
                      ×
                    </button>

                  </div>
                ))}
              </div>
            )}

            {tasks.length > 0 && (
              <>
                <div className="divider" />
                <p className="text-xs text-center" style={{ color: "#b8a07a", letterSpacing: "1px" }}>
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