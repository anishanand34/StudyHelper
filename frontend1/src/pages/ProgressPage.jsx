import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Other"];

const COLORS = {
  Mathematics: "#3b82f6",
  Physics: "#14b8a6",
  Chemistry: "#8b5cf6",
  Biology: "#22c55e",
  English: "#f59e0b",
  History: "#ef4444",
  Geography: "#06b6d4",
  "Computer Science": "#ec4899",
  Other: "#94a3b8",
};

function ProgressPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [aiTips, setAiTips] = useState("");
  const [tipsLoading, setTipsLoading] = useState(false);
  const [form, setForm] = useState({ subject: "Mathematics", topic: "", score: "", totalMarks: "", notes: "" });
  const [formMsg, setFormMsg] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchProgress(); }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/progress", { credentials: "include" });
      const data = await res.json();
      setQuizzes(data.data?.quizzes || []);
    } catch { setQuizzes([]); }
    setLoading(false);
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    setFormMsg("");
    if (!form.topic || !form.score || !form.totalMarks) { setFormMsg("❌ Please fill all required fields"); return; }
    if (Number(form.score) > Number(form.totalMarks)) { setFormMsg("❌ Score cannot exceed total marks"); return; }
    try {
      const res = await fetch("http://localhost:8000/api/v1/progress/add", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, score: Number(form.score), totalMarks: Number(form.totalMarks) }),
      });
      const data = await res.json();
      if (data.data) {
        setQuizzes(data.data.quizzes);
        setForm({ subject: "Mathematics", topic: "", score: "", totalMarks: "", notes: "" });
        setShowForm(false);
        setFormMsg("");
      }
    } catch { setFormMsg("❌ Failed to save. Try again."); }
  };

  const handleDelete = async (entryId) => {
    setDeletingId(entryId);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/progress/delete/${entryId}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.data) setQuizzes(data.data.quizzes);
    } catch {}
    setDeletingId(null);
  };

  const getAITips = async () => {
    setTipsLoading(true);
    setAiTips("");
    const summary = subjectStats.map(s => `${s.subject}: avg ${s.avg}% over ${s.count} quiz(zes)`).join(", ");
    try {
      const res = await fetch("http://localhost:8000/api/v1/chat/send", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Based on my quiz performance: ${summary}. Give me 4-5 specific, actionable study improvement tips. Be concise and encouraging.`
        }),
      });
      const data = await res.json();
      setAiTips(data.data?.reply || "Could not load tips.");
    } catch { setAiTips("Failed to load AI tips. Please try again."); }
    setTipsLoading(false);
  };

  const totalQuizzes = quizzes.length;
  const overallAvg = totalQuizzes === 0 ? 0 : Math.round(quizzes.reduce((acc, q) => acc + (q.score / q.totalMarks) * 100, 0) / totalQuizzes);

  const subjectStats = Object.entries(
    quizzes.reduce((acc, q) => {
      if (!acc[q.subject]) acc[q.subject] = { scores: [], count: 0 };
      acc[q.subject].scores.push((q.score / q.totalMarks) * 100);
      acc[q.subject].count++;
      return acc;
    }, {})
  ).map(([subject, data]) => ({
    subject,
    avg: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    count: data.count,
    color: COLORS[subject] || "#94a3b8",
  })).sort((a, b) => b.avg - a.avg);

  const bestSubject = subjectStats[0] || null;
  const worstSubject = subjectStats[subjectStats.length - 1] || null;

  const trendData = [...quizzes].slice(-8).map(q => ({
    label: q.topic.slice(0, 10),
    pct: Math.round((q.score / q.totalMarks) * 100),
    subject: q.subject,
    color: COLORS[q.subject] || "#94a3b8",
  }));

  const improvement = trendData.length >= 2
    ? trendData[trendData.length - 1].pct - trendData[0].pct
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Lora:wght@400;500;600&display=swap');

        .prog-root {
          font-family: 'Nunito', sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
        }
        .prog-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          pointer-events: none;
          z-index: 0;
        }
        .prog-content { position: relative; z-index: 1; }
        .display-font { font-family: 'Lora', serif; }

        .study-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04);
          position: relative;
        }
        .accent-blue::before {
          content: ''; position: absolute;
          top: 0; left: 20px; right: 20px; height: 3px;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }
        .accent-teal::before {
          content: ''; position: absolute;
          top: 0; left: 20px; right: 20px; height: 3px;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(90deg, #14b8a6, #2dd4bf);
        }
        .accent-purple::before {
          content: ''; position: absolute;
          top: 0; left: 20px; right: 20px; height: 3px;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
        }
        .accent-green::before {
          content: ''; position: absolute;
          top: 0; left: 20px; right: 20px; height: 3px;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(90deg, #22c55e, #4ade80);
        }

        .stat-card {
          background: #ffffff; border: 1px solid #e2e8f0;
          border-radius: 14px; padding: 18px;
          display: flex; align-items: center; gap: 14px;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 1px 3px rgba(15,23,42,0.05);
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.1); }

        .pill { font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 999px; letter-spacing: 0.3px; }
        .pill-blue  { background: #dbeafe; color: #1d4ed8; }
        .pill-teal  { background: #ccfbf1; color: #0f766e; }
        .pill-green { background: #dcfce7; color: #15803d; }
        .pill-red   { background: #fee2e2; color: #b91c1c; }
        .pill-purple{ background: #ede9fe; color: #6d28d9; }

        .soft-divider { height: 1px; background: #f1f5f9; margin: 14px 0; }

        .tab-btn {
          padding: 8px 20px; border-radius: 10px; border: none;
          font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.15s;
        }
        .tab-btn.active {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #ffffff; box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }
        .tab-btn.inactive { background: #f8fafc; color: #64748b; border: 1.5px solid #e2e8f0; }
        .tab-btn.inactive:hover { background: #eff6ff; color: #1d4ed8; border-color: #93c5fd; }

        .form-input {
          width: 100%; padding: 10px 14px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: #f8fafc;
          color: #1e293b; font-size: 13px; font-family: 'Nunito', sans-serif;
          font-weight: 500; outline: none; box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .form-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 6px; }

        .add-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff; border: none; border-radius: 10px;
          padding: 10px 22px; font-family: 'Nunito', sans-serif;
          font-size: 13px; font-weight: 700; cursor: pointer;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
          transition: transform 0.15s, box-shadow 0.2s;
        }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(59,130,246,0.35); }

        .cancel-btn {
          background: transparent; border: 1.5px solid #e2e8f0;
          color: #64748b; border-radius: 10px; padding: 10px 22px;
          font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer;
        }

        .del-btn {
          background: #fee2e2; border: none; color: #dc2626;
          border-radius: 8px; padding: 5px 10px;
          font-size: 11px; font-weight: 700; cursor: pointer;
          font-family: 'Nunito', sans-serif; transition: background 0.15s;
        }
        .del-btn:hover { background: #fca5a5; }

        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 700; color: #64748b;
          cursor: pointer; background: none; border: none;
          font-family: 'Nunito', sans-serif; padding: 6px 12px;
          border-radius: 8px; transition: background 0.15s, color 0.15s;
        }
        .back-btn:hover { background: #eff6ff; color: #1d4ed8; }

        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-1 { animation-delay: 0.08s; }
        .delay-2 { animation-delay: 0.16s; }
        .delay-3 { animation-delay: 0.24s; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .greeting-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          border-radius: 999px; padding: 4px 14px;
          font-size: 11px; font-weight: 700; color: #1d4ed8; letter-spacing: 0.5px;
        }

        .quiz-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 0; border-bottom: 1px solid #f8fafc;
          transition: background 0.1s;
        }
        .quiz-row:last-child { border-bottom: none; }

        .tips-text {
          font-size: 13px; line-height: 1.9; color: #334155;
          white-space: pre-wrap; font-family: 'Nunito', sans-serif; font-weight: 500;
        }

        .dots span {
          display: inline-block; width: 7px; height: 7px; border-radius: 50%;
          background: #3b82f6; margin: 0 2px;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40%           { transform: translateY(-7px); opacity: 1; }
        }
      `}</style>

      <div className="prog-root">
        <div className="prog-content" style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 28px" }}>

          {/* Header */}
          <div className="fade-up" style={{ marginBottom: "28px" }}>
            <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>← Back</button>
            <div className="greeting-badge" style={{ marginBottom: "10px" }}>
              <span>📊</span> Progress Tracker
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h1 className="display-font" style={{ fontSize: "32px", fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
                  My Progress
                </h1>
                <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px", fontWeight: 500 }}>
                  Track your quiz scores and measure improvement over time.
                </p>
              </div>
              <button className="add-btn" onClick={() => setShowForm(true)}>+ Log Quiz</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }} className="fade-up delay-1">
            {["overview", "history", "tips"].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : "inactive"}`} onClick={() => setActiveTab(tab)}>
                {tab === "overview" ? "📈 Overview" : tab === "history" ? "📋 Quiz History" : "✦ AI Tips"}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
              <div className="dots"><span /><span /><span /></div>
            </div>
          ) : (
            <>
              {/* ── OVERVIEW TAB ── */}
              {activeTab === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                  {/* Stats row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }} className="fade-up">
                    {[
                      { icon: "📝", label: "Total Quizzes", value: totalQuizzes, unit: "taken", color: "#3b82f6" },
                      { icon: "⭐", label: "Overall Avg", value: `${overallAvg}%`, unit: "score", color: "#14b8a6" },
                      { icon: "🏆", label: "Best Subject", value: bestSubject?.subject?.slice(0, 8) || "—", unit: bestSubject ? `${bestSubject.avg}% avg` : "no data", color: "#22c55e" },
                      { icon: improvement > 0 ? "📈" : improvement < 0 ? "📉" : "➡️", label: "Trend", value: improvement !== null ? `${improvement > 0 ? "+" : ""}${improvement}%` : "—", unit: "recent change", color: improvement > 0 ? "#22c55e" : improvement < 0 ? "#ef4444" : "#94a3b8" },
                    ].map(s => (
                      <div key={s.label} className="stat-card">
                        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#eff6ff", border: "1px solid #dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{s.icon}</div>
                        <div>
                          <div className="display-font" style={{ fontSize: "22px", color: s.color, lineHeight: 1, fontWeight: 600 }}>{s.value}</div>
                          <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#94a3b8", marginTop: "2px" }}>{s.label}</div>
                          <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>{s.unit}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

                    {/* Score Trend Bar Chart */}
                    <div className="study-card accent-blue fade-up delay-1" style={{ padding: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <h3 className="display-font" style={{ fontSize: "17px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Score Trend</h3>
                        <span className="pill pill-blue">Last {trendData.length} quizzes</span>
                      </div>
                      <div className="soft-divider" />
                      {trendData.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>
                          No quizzes yet. Log your first quiz!
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={160}>
                          <BarChart data={trendData} barSize={28}>
                            <XAxis
                              dataKey="label"
                              tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "Nunito", fontWeight: 600 }}
                              axisLine={false} tickLine={false}
                            />
                            <YAxis
                              domain={[0, 100]}
                              tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "Nunito", fontWeight: 600 }}
                              axisLine={false} tickLine={false}
                              tickFormatter={(v) => `${v}%`}
                              width={36}
                            />
                            <Tooltip
                              formatter={(value) => [`${value}%`, "Score"]}
                              contentStyle={{ fontFamily: "Nunito", fontSize: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(15,23,42,0.08)" }}
                              cursor={{ fill: "rgba(59,130,246,0.06)" }}
                            />
                            <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                              {trendData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    {/* Subject Donut Chart */}
                    <div className="study-card accent-teal fade-up delay-2" style={{ padding: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <h3 className="display-font" style={{ fontSize: "17px", fontWeight: 600, color: "#0f172a", margin: 0 }}>By Subject</h3>
                        <span className="pill pill-teal">{subjectStats.length} subjects</span>
                      </div>
                      <div className="soft-divider" />
                      {subjectStats.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>No data yet</div>
                      ) : (
                        <ResponsiveContainer width="100%" height={160}>
                          <PieChart>
                            <Pie
                              data={subjectStats}
                              dataKey="avg"
                              nameKey="subject"
                              cx="50%"
                              cy="50%"
                              innerRadius={42}
                              outerRadius={68}
                              paddingAngle={3}
                            >
                              {subjectStats.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value, name) => [`${value}%`, name]}
                              contentStyle={{ fontFamily: "Nunito", fontSize: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(15,23,42,0.08)" }}
                            />
                            <Legend
                              iconType="circle"
                              iconSize={8}
                              formatter={(value) => <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", fontFamily: "Nunito" }}>{value}</span>}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Best / Worst */}
                  {subjectStats.length >= 2 && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="fade-up delay-3">
                      <div className="study-card accent-green" style={{ padding: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ fontSize: "32px" }}>🏆</div>
                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8" }}>Strongest Subject</div>
                            <div className="display-font" style={{ fontSize: "20px", color: "#15803d", fontWeight: 600 }}>{bestSubject.subject}</div>
                            <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>{bestSubject.avg}% average across {bestSubject.count} quiz(zes)</div>
                          </div>
                        </div>
                      </div>
                      <div className="study-card accent-purple" style={{ padding: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ fontSize: "32px" }}>📚</div>
                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8" }}>Needs Attention</div>
                            <div className="display-font" style={{ fontSize: "20px", color: "#6d28d9", fontWeight: 600 }}>{worstSubject.subject}</div>
                            <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>{worstSubject.avg}% average across {worstSubject.count} quiz(zes)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── HISTORY TAB ── */}
              {activeTab === "history" && (
                <div className="study-card accent-blue fade-up" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <h3 className="display-font" style={{ fontSize: "17px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Quiz History</h3>
                    <span className="pill pill-blue">{totalQuizzes} total</span>
                  </div>
                  <div className="soft-divider" />
                  {quizzes.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 0" }}>
                      <div style={{ fontSize: "40px", marginBottom: "10px" }}>📝</div>
                      <p style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>No quizzes logged yet.</p>
                      <p style={{ color: "#cbd5e1", fontSize: "12px" }}>Click "Log Quiz" to add your first entry.</p>
                    </div>
                  ) : (
                    <div style={{ maxHeight: "480px", overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#bfdbfe #f0f9ff" }}>
                      {[...quizzes].reverse().map((q) => {
                        const pct = Math.round((q.score / q.totalMarks) * 100);
                        return (
                          <div key={q._id} className="quiz-row">
                            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: COLORS[q.subject] + "22", border: `1px solid ${COLORS[q.subject]}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                              {pct >= 80 ? "🌟" : pct >= 60 ? "📖" : "💪"}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{q.topic}</span>
                                <span style={{ fontSize: "10px", padding: "1px 8px", borderRadius: "999px", background: COLORS[q.subject] + "22", color: COLORS[q.subject], fontWeight: 700 }}>{q.subject}</span>
                                <span style={{ fontSize: "10px", padding: "1px 8px", borderRadius: "999px", background: q.source === "ai" ? "#ede9fe" : "#f1f5f9", color: q.source === "ai" ? "#6d28d9" : "#64748b", fontWeight: 700 }}>{q.source === "ai" ? "✦ AI" : "Manual"}</span>
                              </div>
                              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px", fontWeight: 500 }}>
                                {new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                {q.notes && <span> · {q.notes}</span>}
                              </div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div className="display-font" style={{ fontSize: "20px", color: pct >= 80 ? "#15803d" : pct >= 60 ? "#1d4ed8" : "#b91c1c", fontWeight: 600 }}>{pct}%</div>
                              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>{q.score}/{q.totalMarks}</div>
                            </div>
                            <button className="del-btn" onClick={() => handleDelete(q._id)} disabled={deletingId === q._id}>
                              {deletingId === q._id ? "..." : "✕"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── AI TIPS TAB ── */}
              {activeTab === "tips" && (
                <div className="study-card accent-purple fade-up" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <h3 className="display-font" style={{ fontSize: "17px", fontWeight: 600, color: "#0f172a", margin: 0 }}>AI Study Tips</h3>
                    <span className="pill pill-purple">✦ Claude AI</span>
                  </div>
                  <div className="soft-divider" />
                  {subjectStats.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 0" }}>
                      <div style={{ fontSize: "40px", marginBottom: "10px" }}>✦</div>
                      <p style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>Log some quizzes first to get personalized tips.</p>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: "13px", color: "#64748b", fontWeight: 500, marginBottom: "16px" }}>
                        Get personalized improvement tips based on your quiz performance across {subjectStats.length} subject(s).
                      </p>
                      <button className="add-btn" onClick={getAITips} disabled={tipsLoading} style={{ marginBottom: "20px", opacity: tipsLoading ? 0.7 : 1 }}>
                        {tipsLoading ? "Generating..." : aiTips ? "🔄 Refresh Tips" : "✦ Get AI Tips"}
                      </button>
                      {tipsLoading && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 0" }}>
                          <div className="dots"><span /><span /><span /></div>
                          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>Claude is analyzing your progress...</span>
                        </div>
                      )}
                      {aiTips && !tipsLoading && (
                        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px" }}>
                          <p className="tips-text">{aiTips}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Log Quiz Modal ── */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "20px", width: "100%", maxWidth: "420px", margin: "16px", padding: "32px", boxShadow: "0 24px 60px rgba(15,23,42,0.14)", fontFamily: "'Nunito', sans-serif", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "20px", right: "20px", height: "3px", borderRadius: "0 0 4px 4px", background: "linear-gradient(90deg, #3b82f6, #14b8a6)" }} />
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: "22px", color: "#0f172a", margin: "0 0 4px", fontWeight: 600 }}>Log a Quiz</h2>
            <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 20px" }}>Record your quiz score manually</p>

            <form onSubmit={handleAddQuiz}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="form-label">Subject *</label>
                  <select className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="form-label">Topic *</label>
                  <input className="form-input" placeholder="e.g. Quadratic Equations" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Score *</label>
                  <input className="form-input" type="number" min="0" placeholder="e.g. 18" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Total Marks *</label>
                  <input className="form-input" type="number" min="1" placeholder="e.g. 20" value={form.totalMarks} onChange={e => setForm({ ...form, totalMarks: e.target.value })} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label className="form-label">Notes (optional)</label>
                  <input className="form-input" placeholder="Any notes about this quiz..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>

              {formMsg && (
                <div style={{ marginBottom: "14px", padding: "10px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, textAlign: "center", color: "#b91c1c", background: "#fee2e2", border: "1px solid #fca5a5" }}>
                  {formMsg}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setFormMsg(""); }}>Cancel</button>
                <button type="submit" className="add-btn" style={{ flex: 1 }}>Save Quiz</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ProgressPage;