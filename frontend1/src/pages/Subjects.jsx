import { useState } from "react";

const defaultSubjects = [
  { name: "Mathematics", icon: "∑", sessions: 14, progress: 72 },
  { name: "Data Structures", icon: "⬡", sessions: 9, progress: 45 },
  { name: "Operating Systems", icon: "⚙", sessions: 20, progress: 88 },
];

const icons = ["∑", "⚛", "⬡", "✦", "⚙", "📐", "🧪", "📖", "🌍", "💡"];

function Subjects() {
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState(defaultSubjects);
  const [iconIndex, setIconIndex] = useState(0);

  const addSubject = () => {
    if (subject.trim() !== "") {
      setSubjects([...subjects, {
        name: subject,
        icon: icons[iconIndex % icons.length],
        sessions: 0,
        progress: 0,
      }]);
      setSubject("");
      setIconIndex(i => i + 1);
    }
  };

  const deleteSubject = (i) =>
    setSubjects(subjects.filter((_, idx) => idx !== i));

  const colors = [
    "#b8975a", "#8a6d38", "#c4a96e", "#7a8a6a", "#6a7a8a",
    "#8a6a7a", "#7a6a8a", "#9a7a5a", "#6a8a7a", "#8a7a6a",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500&display=swap');

        .sub-root { font-family: 'Montserrat', sans-serif; background: #f7f4ee; min-height: 100vh; }
        .sub-title { font-family: 'Cormorant Garamond', serif; }

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

        .sub-input {
          background: #f9f6ef;
          border: 1px solid rgba(184,151,90,0.3);
          border-radius: 12px;
          padding: 12px 16px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          color: #2c2416;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          width: 100%;
        }
        .sub-input:focus {
          border-color: #b8975a;
          box-shadow: 0 0 0 3px rgba(184,151,90,0.13);
          background: #fffef9;
        }
        .sub-input::placeholder { color: #b8a07a; }

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

        .subject-card {
          background: rgba(255,253,247,0.92);
          border: 1px solid rgba(184,151,90,0.22);
          box-shadow: 0 4px 16px rgba(100,80,40,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
          border-radius: 16px;
          padding: 24px 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          animation: cardIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
          text-align: center;
        }
        .subject-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(100,80,40,0.13);
          border-color: rgba(184,151,90,0.45);
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .subject-icon-wrap {
          width: 56px; height: 56px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin: 0 auto 14px;
          transition: transform 0.2s;
        }
        .subject-card:hover .subject-icon-wrap { transform: scale(1.1); }

        .del-btn {
          position: absolute; top: 10px; right: 12px;
          background: none; border: none; cursor: pointer;
          color: rgba(184,151,90,0.35); font-size: 18px;
          transition: color 0.2s; line-height: 1;
        }
        .del-btn:hover { color: #c0392b; }

        .badge {
          font-size: 10px; padding: 2px 8px; border-radius: 20px;
          font-family: 'Montserrat', sans-serif; letter-spacing: 1px;
          background: rgba(184,151,90,0.12); color: #8a6d38;
          border: 1px solid rgba(184,151,90,0.25);
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

        .progress-bar {
          height: 3px; border-radius: 4px;
          background: rgba(184,151,90,0.15); margin-top: 10px;
        }
        .progress-fill {
          height: 100%; border-radius: 4px;
          transition: width 0.6s ease;
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
          grid-column: 1 / -1;
        }

        .icon-picker {
          display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;
        }
        .icon-btn {
          width: 34px; height: 34px; border-radius: 8px;
          border: 1px solid rgba(184,151,90,0.25);
          background: #f9f6ef; cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .icon-btn:hover { background: #f3ede0; border-color: #b8975a; transform: scale(1.1); }
        .icon-btn.selected { background: rgba(184,151,90,0.2); border-color: #b8975a; }
      `}</style>

      <div className="sub-root">

        {/* Bg glows */}
        <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(184,151,90,0.07) 0%, transparent 70%)" }} />
        <div className="fixed bottom-0 left-0 w-48 h-48 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,107,52,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="fade-in mb-10">
            <div className="ornament mb-2">✦ ✦ ✦</div>
            <h1 className="sub-title text-5xl font-light" style={{ color: "#2c2416", letterSpacing: "1px" }}>
              My Subjects
            </h1>
            <div style={{ width: "56px", height: "1px", background: "linear-gradient(90deg, #b8975a, transparent)", marginTop: "12px" }} />
            <p className="mt-2 text-xs uppercase tracking-widest" style={{ color: "#9a8060", letterSpacing: "3px" }}>
              {subjects.length} subject{subjects.length !== 1 ? "s" : ""} enrolled
            </p>
          </div>

          {/* Add Subject Card */}
          <div className="card relative p-7 mb-8 fade-in">
            <div className="card-top-line" />
            <div className="flex items-center justify-between mb-1">
              <h3 className="sub-title text-2xl font-light" style={{ color: "#2c2416" }}>Add New Subject</h3>
              <span className="badge">✦ Enroll</span>
            </div>
            <div className="divider" />

            <div className="flex gap-3 items-center">
              <input
                className="sub-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubject()}
                placeholder="Enter subject name..."
              />
              <button className="add-btn" onClick={addSubject}>
                Add ✦
              </button>
            </div>

            {/* Icon picker */}
            <div>
              <p className="text-xs mt-4 mb-2 uppercase tracking-widest" style={{ color: "#9a8060", letterSpacing: "2px" }}>
                Pick an icon
              </p>
              <div className="icon-picker">
                {icons.map((ic, i) => (
                  <button
                    key={i}
                    className={`icon-btn ${iconIndex % icons.length === i ? "selected" : ""}`}
                    onClick={() => setIconIndex(i)}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="fade-in-delay">
            <div className="flex items-center justify-between mb-4">
              <h3 className="sub-title text-2xl font-light" style={{ color: "#2c2416" }}>Enrolled Subjects</h3>
              <span className="badge">{subjects.length} total</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
              {subjects.length === 0 ? (
                <div className="empty-state">No subjects yet — add one above ✦</div>
              ) : (
                subjects.map((s, i) => {
                  const color = colors[i % colors.length];
                  return (
                    <div key={i} className="subject-card" style={{ borderTop: `3px solid ${color}` }}>
                      <button className="del-btn" onClick={() => deleteSubject(i)}>×</button>

                      <div
                        className="subject-icon-wrap"
                        style={{ background: `${color}18`, border: `1px solid ${color}35` }}
                      >
                        <span style={{ color }}>{s.icon}</span>
                      </div>

                      <div className="sub-title text-xl font-light mb-1" style={{ color: "#2c2416" }}>
                        {s.name}
                      </div>

                      <div className="text-xs mb-3" style={{ color: "#9a8060", letterSpacing: "1px" }}>
                        {s.sessions} session{s.sessions !== 1 ? "s" : ""}
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${s.progress}%`,
                            background: `linear-gradient(90deg, ${color}, ${color}80)`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between mt-2">
                        <span className="text-xs" style={{ color: "#b8a07a" }}>Progress</span>
                        <span className="text-xs" style={{ color }}>{s.progress}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Subjects;