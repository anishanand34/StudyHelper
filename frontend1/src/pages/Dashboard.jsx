import { useState } from "react";

const tasks = [
  { label: "Math Assignment", due: "Today", done: false },
  { label: "DSA Practice", due: "Tomorrow", done: false },
  { label: "OS Revision", due: "Wed", done: true },
];

const subjects = [
  { name: "Mathematics", hours: 1.5, color: "#b8975a" },
  { name: "Data Structures", hours: 1.5, color: "#8a6d38" },
  { name: "Operating Systems", hours: 1.0, color: "#c4a96e" },
];

function Dashboard() {
  const [checked, setChecked] = useState(
    tasks.map((t) => t.done)
  );

  const toggle = (i) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500&display=swap');

        .dash-root { font-family: 'Montserrat', sans-serif; background: #f7f4ee; min-height: 100vh; }
        .dash-title { font-family: 'Cormorant Garamond', serif; }

        .card {
          background: rgba(255,253,247,0.92);
          border: 1px solid rgba(184,151,90,0.22);
          box-shadow: 0 8px 32px rgba(100,80,40,0.08), 0 2px 8px rgba(100,80,40,0.04), inset 0 1px 0 rgba(255,255,255,0.8);
          border-radius: 18px;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .card:hover {
          box-shadow: 0 16px 48px rgba(100,80,40,0.13), 0 4px 12px rgba(100,80,40,0.07);
          transform: translateY(-2px);
        }

        .card-top-line {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #b8975a, transparent);
          border-radius: 18px 18px 0 0;
        }

        .task-item {
          border: 1px solid rgba(184,151,90,0.18);
          border-radius: 12px;
          background: #f9f6ef;
          transition: background 0.2s, border-color 0.2s;
        }
        .task-item:hover { background: #f3ede0; border-color: rgba(184,151,90,0.4); }

        .checkbox {
          width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0; cursor: pointer;
          border: 1.5px solid #b8975a; background: transparent;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .checkbox.checked { background: linear-gradient(135deg, #b8975a, #8a6d38); border-color: transparent; }

        .bar-fill { border-radius: 4px; transition: width 0.8s ease; }

        .badge {
          font-size: 10px; padding: 2px 8px; border-radius: 20px;
          font-family: 'Montserrat', sans-serif; letter-spacing: 1px;
          background: rgba(184,151,90,0.12); color: #8a6d38; border: 1px solid rgba(184,151,90,0.25);
        }

        .ornament {
          font-family: 'Cormorant Garamond', serif;
          color: #b8975a; opacity: 0.5; letter-spacing: 6px; font-size: 14px;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4c4a0, transparent);
          margin: 16px 0;
        }

        .stat-num { font-family: 'Cormorant Garamond', serif; color: #b8975a; line-height: 1; }

        .fade-in { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-in:nth-child(2) { animation-delay: 0.1s; }
        .fade-in:nth-child(3) { animation-delay: 0.2s; }
        .fade-in:nth-child(4) { animation-delay: 0.3s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="dash-root" style={{ background: "#f7f4ee" }}>

        {/* Subtle bg glows */}
        <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(184,151,90,0.07) 0%, transparent 70%)" }} />
        <div className="fixed bottom-0 left-0 w-48 h-48 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,107,52,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="fade-in mb-10">
            <div className="ornament mb-2">✦ ✦ ✦</div>
            <h1 className="dash-title text-5xl font-light" style={{ color: "#2c2416", letterSpacing: "1px" }}>
              Study Dashboard
            </h1>
            <div style={{ width: "56px", height: "1px", background: "linear-gradient(90deg, #b8975a, transparent)", marginTop: "12px" }} />
            <p className="mt-2 text-xs uppercase tracking-widest" style={{ color: "#9a8060", letterSpacing: "3px" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Top Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6 fade-in">
            {[
              { label: "Subjects Studied", value: "3", sub: "today" },
              { label: "Study Time", value: "4h", sub: "logged" },
              { label: "Tasks Done", value: `${checked.filter(Boolean).length}/${tasks.length}`, sub: "completed" },
            ].map((s) => (
              <div key={s.label} className="card relative p-6 text-center">
                <div className="card-top-line" />
                <div className="stat-num text-5xl font-light mb-1">{s.value}</div>
                <div className="text-xs uppercase tracking-widest" style={{ color: "#9a8060", letterSpacing: "2px" }}>{s.label}</div>
                <div className="text-xs mt-1" style={{ color: "#c4b08a" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* Today's Progress */}
            <div className="card relative p-7 fade-in">
              <div className="card-top-line" />
              <div className="flex items-center justify-between mb-1">
                <h3 className="dash-title text-2xl font-light" style={{ color: "#2c2416" }}>Today's Progress</h3>
                <span className="badge">Daily</span>
              </div>
              <div className="divider" />

              <div className="space-y-5">
                {subjects.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs uppercase tracking-widest" style={{ color: "#7a6040", letterSpacing: "1.5px" }}>
                        {s.name}
                      </span>
                      <span className="text-xs font-medium" style={{ color: "#b8975a" }}>{s.hours}h</span>
                    </div>
                    <div className="w-full rounded-full" style={{ height: "5px", background: "rgba(184,151,90,0.15)" }}>
                      <div
                        className="bar-fill"
                        style={{
                          height: "5px",
                          width: `${(s.hours / 4) * 100}%`,
                          background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider" />
              <div className="flex justify-between text-xs" style={{ color: "#9a8060" }}>
                <span>Total studied</span>
                <span style={{ color: "#b8975a", fontWeight: 500 }}>4h / 6h goal</span>
              </div>
              <div className="w-full rounded-full mt-2" style={{ height: "4px", background: "rgba(184,151,90,0.15)" }}>
                <div className="bar-fill" style={{ height: "4px", width: "66%", background: "linear-gradient(90deg, #b8975a, #8a6d38)" }} />
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="card relative p-7 fade-in">
              <div className="card-top-line" />
              <div className="flex items-center justify-between mb-1">
                <h3 className="dash-title text-2xl font-light" style={{ color: "#2c2416" }}>Upcoming Tasks</h3>
                <span className="badge">{tasks.length - checked.filter(Boolean).length} left</span>
              </div>
              <div className="divider" />

              <ul className="space-y-3">
                {tasks.map((task, i) => (
                  <li
                    key={i}
                    className="task-item flex items-center gap-3 px-4 py-3 cursor-pointer"
                    onClick={() => toggle(i)}
                  >
                    <div className={`checkbox ${checked[i] ? "checked" : ""}`}>
                      {checked[i] && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="flex-1 text-sm"
                      style={{
                        color: checked[i] ? "#b8a080" : "#2c2416",
                        textDecoration: checked[i] ? "line-through" : "none",
                        fontFamily: "'Montserrat', sans-serif",
                        transition: "color 0.2s",
                      }}
                    >
                      {task.label}
                    </span>
                    <span className="badge">{task.due}</span>
                  </li>
                ))}
              </ul>

              <div className="divider" />
              <p className="text-xs text-center" style={{ color: "#b8a080", letterSpacing: "1px" }}>
                Click a task to mark complete
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;