import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE = "http://localhost:8000/api/v1";

const getSubjects = () => fetch(`${BASE}/subjects`).then((r) => r.json());

const addSubjectAPI = (name, icon) =>
  fetch(`${BASE}/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, icon }),
  }).then((r) => r.json());

const deleteSubjectAPI = (id) =>
  fetch(`${BASE}/subjects/${id}`, { method: "DELETE" }).then((r) => r.json());

const icons = ["∑", "⚛", "⬡", "✦", "⚙", "📐", "🧪", "📖", "🌍", "💡"];

function Subjects() {
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [iconIndex, setIconIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load subjects from DB on mount
  useEffect(() => {
    getSubjects().then((data) => {
      setSubjects(data);
      setLoading(false);
    });
  }, []);

  const addSubject = async () => {
    if (!subject.trim()) return;
    const newSubject = await addSubjectAPI(
      subject.trim(),
      icons[iconIndex % icons.length]
    );
    setSubjects((prev) => [...prev, newSubject]);
    setSubject("");
    setIconIndex((i) => i + 1);
  };

  const deleteSubject = async (id) => {
    await deleteSubjectAPI(id);
    setSubjects((prev) => prev.filter((s) => s._id !== id));
  };

  const colors = [
    { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", bar: ["#3b82f6", "#60a5fa"] },
    { bg: "#ccfbf1", border: "#99f6e4", text: "#0f766e", bar: ["#14b8a6", "#2dd4bf"] },
    { bg: "#ede9fe", border: "#c4b5fd", text: "#6d28d9", bar: ["#8b5cf6", "#a78bfa"] },
    { bg: "#dcfce7", border: "#86efac", text: "#15803d", bar: ["#22c55e", "#4ade80"] },
    { bg: "#ffedd5", border: "#fed7aa", text: "#c2410c", bar: ["#f97316", "#fb923c"] },
    { bg: "#fce7f3", border: "#f9a8d4", text: "#9d174d", bar: ["#ec4899", "#f472b6"] },
    { bg: "#e0f2fe", border: "#7dd3fc", text: "#0369a1", bar: ["#0ea5e9", "#38bdf8"] },
    { bg: "#fef9c3", border: "#fde047", text: "#a16207", bar: ["#eab308", "#facc15"] },
    { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", bar: ["#16a34a", "#4ade80"] },
    { bg: "#f1f5f9", border: "#cbd5e1", text: "#334155", bar: ["#64748b", "#94a3b8"] },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Lora:wght@400;500;600&display=swap');

        .sub-root {
          font-family: 'Nunito', sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
        }

        .sub-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          pointer-events: none;
          z-index: 0;
        }

        .sub-content { position: relative; z-index: 1; }
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

        .sub-input {
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
          width: 100%;
          box-sizing: border-box;
        }
        .sub-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
          background: #ffffff;
        }
        .sub-input::placeholder { color: #94a3b8; }

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

        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #ffffff; border: 1.5px solid #e2e8f0;
          border-radius: 10px; padding: 7px 14px;
          font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700;
          color: #64748b; cursor: pointer;
          transition: border-color 0.2s, color 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 1px 3px rgba(15,23,42,0.06);
          text-decoration: none;
        }
        .back-btn:hover {
          border-color: #93c5fd; color: #1d4ed8;
          background: #eff6ff; box-shadow: 0 2px 8px rgba(59,130,246,0.12);
        }
        .back-btn:active { transform: translateX(-1px); }
        .back-arrow { font-size: 14px; transition: transform 0.2s; }
        .back-btn:hover .back-arrow { transform: translateX(-2px); }

        .subject-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px 18px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: cardIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
          text-align: center;
          box-shadow: 0 1px 3px rgba(15,23,42,0.05);
        }
        .subject-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(59,130,246,0.1);
          border-color: #bfdbfe;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .subject-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin: 0 auto 12px;
          transition: transform 0.2s;
        }
        .subject-card:hover .subject-icon-wrap { transform: scale(1.1); }

        .del-btn {
          position: absolute; top: 10px; right: 12px;
          background: none; border: none; cursor: pointer;
          color: #cbd5e1; font-size: 18px;
          transition: color 0.15s; line-height: 1;
        }
        .del-btn:hover { color: #ef4444; }

        .pill {
          font-size: 11px; font-weight: 700; padding: 2px 10px;
          border-radius: 999px;
        }
        .pill-blue { background: #dbeafe; color: #1d4ed8; }

        .soft-divider { height: 1px; background: #f1f5f9; margin: 14px 0; }

        .prog-track { height: 4px; border-radius: 999px; background: #f1f5f9; margin-top: 8px; }
        .prog-fill  { height: 100%; border-radius: 999px; transition: width 0.6s ease; }

        .icon-btn {
          width: 34px; height: 34px; border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc; cursor: pointer; font-size: 15px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
        }
        .icon-btn:hover { background: #eff6ff; border-color: #93c5fd; transform: scale(1.1); }
        .icon-btn.selected { background: #dbeafe; border-color: #3b82f6; }

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

      <div className="sub-root">
        <div className="sub-content max-w-4xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="fade-up mb-8">
            <div style={{ marginBottom: "16px" }}>
              <button className="back-btn" onClick={() => navigate(-1)}>
                <span className="back-arrow">←</span>
                Back
              </button>
            </div>
            <div className="greeting-badge mb-4">
              <span>📚</span> My Subjects
            </div>
            <h1
              className="display-font text-4xl font-semibold"
              style={{ color: "#0f172a", letterSpacing: "-0.5px" }}
            >
              Enrolled Subjects
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
              {subjects.length} subject{subjects.length !== 1 ? "s" : ""} enrolled
            </p>
          </div>

          {/* Add Subject Card */}
          <div className="study-card accent-blue p-6 mb-8 fade-up delay-1">
            <div className="flex items-center justify-between mb-1">
              <h3
                className="display-font text-xl font-semibold"
                style={{ color: "#0f172a" }}
              >
                Add New Subject
              </h3>
              <span className="pill pill-blue">+ Enroll</span>
            </div>
            <div className="soft-divider" />

            <div className="flex gap-3 items-center">
              <input
                className="sub-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubject()}
                placeholder="Enter subject name..."
              />
              <button className="add-btn" onClick={addSubject}>
                + Add
              </button>
            </div>

            {/* Icon picker */}
            <div>
              <p
                className="text-xs mt-4 mb-2 font-bold uppercase"
                style={{ color: "#94a3b8", letterSpacing: "0.8px" }}
              >
                Pick an icon
              </p>
              <div className="flex gap-2 flex-wrap">
                {icons.map((ic, i) => (
                  <button
                    key={i}
                    className={`icon-btn ${
                      iconIndex % icons.length === i ? "selected" : ""
                    }`}
                    onClick={() => setIconIndex(i)}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="fade-up delay-2">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="display-font text-xl font-semibold"
                style={{ color: "#0f172a" }}
              >
                All Subjects
              </h3>
              <span className="pill pill-blue">{subjects.length} total</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "14px",
              }}
            >
              {loading ? (
                <div
                  style={{ gridColumn: "1 / -1" }}
                  className="flex flex-col items-center justify-center py-12 gap-2"
                >
                  <span style={{ fontSize: "32px" }}>⏳</span>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#94a3b8" }}
                  >
                    Loading subjects...
                  </p>
                </div>
              ) : subjects.length === 0 ? (
                <div
                  style={{ gridColumn: "1 / -1" }}
                  className="flex flex-col items-center justify-center py-12 gap-2"
                >
                  <span style={{ fontSize: "32px" }}>📚</span>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#94a3b8" }}
                  >
                    No subjects yet
                  </p>
                  <p className="text-xs" style={{ color: "#cbd5e1" }}>
                    Add one above to get started
                  </p>
                </div>
              ) : (
                subjects.map((s, i) => {
                  const c = colors[i % colors.length];
                  return (
                    <div
                      key={s._id}
                      className="subject-card"
                      style={{ borderTop: `3px solid ${c.border}` }}
                    >
                      <button
                        className="del-btn"
                        onClick={() => deleteSubject(s._id)}
                      >
                        ×
                      </button>

                      <div
                        className="subject-icon-wrap"
                        style={{
                          background: c.bg,
                          border: `1px solid ${c.border}`,
                        }}
                      >
                        <span style={{ color: c.text, fontSize: "22px" }}>
                          {s.icon}
                        </span>
                      </div>

                      <div
                        className="display-font text-lg font-semibold mb-1"
                        style={{ color: "#0f172a" }}
                      >
                        {s.name}
                      </div>

                      <div
                        className="text-xs font-semibold mb-3"
                        style={{ color: "#94a3b8" }}
                      >
                        {s.sessions} session{s.sessions !== 1 ? "s" : ""}
                      </div>

                      <div className="prog-track">
                        <div
                          className="prog-fill"
                          style={{
                            width: `${s.progress}%`,
                            background: `linear-gradient(90deg, ${c.bar[0]}, ${c.bar[1]})`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between mt-2">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "#94a3b8" }}
                        >
                          Progress
                        </span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: c.text }}
                        >
                          {s.progress}%
                        </span>
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