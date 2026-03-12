import { useState } from "react";

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "YOUR_ANTHROPIC_API_KEY_HERE", // 🔑 Replace with your key
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-calls": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are an expert study assistant. Help students understand concepts, solve problems, and prepare for exams. Be clear, concise, and encouraging.",
          messages: [{ role: "user", content: question }]
        })
      });
      const data = await res.json();
      setResponse(data.content?.[0]?.text || "No response received.");
    } catch {
      setResponse("Connection error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500&display=swap');

        .ai-root { font-family: 'Montserrat', sans-serif; background: #f7f4ee; min-height: 100vh; }
        .ai-title { font-family: 'Cormorant Garamond', serif; }

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

        .ai-textarea {
          width: 100%;
          background: #f9f6ef;
          border: 1px solid rgba(184,151,90,0.3);
          border-radius: 14px;
          padding: 16px 18px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          color: #2c2416;
          resize: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          outline: none;
        }
        .ai-textarea:focus {
          border-color: #b8975a;
          box-shadow: 0 0 0 3px rgba(184,151,90,0.13);
          background: #fffef9;
        }
        .ai-textarea::placeholder { color: #b8a07a; }

        .ask-btn {
          background: linear-gradient(135deg, #b8975a, #8a6d38);
          color: #fff8ee;
          border: none;
          border-radius: 12px;
          padding: 12px 32px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s;
        }
        .ask-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(139,107,52,0.28);
        }
        .ask-btn:active { transform: translateY(0); }
        .ask-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4c4a0, transparent);
          margin: 16px 0;
        }

        .ornament {
          font-family: 'Cormorant Garamond', serif;
          color: #b8975a; opacity: 0.5; letter-spacing: 6px; font-size: 14px;
        }

        .badge {
          font-size: 10px; padding: 2px 8px; border-radius: 20px;
          font-family: 'Montserrat', sans-serif; letter-spacing: 1px;
          background: rgba(184,151,90,0.12); color: #8a6d38;
          border: 1px solid rgba(184,151,90,0.25);
        }

        .response-text {
          font-size: 13px;
          line-height: 1.85;
          color: #4a3c28;
          white-space: pre-wrap;
          font-family: 'Montserrat', sans-serif;
        }

        .dots span {
          display: inline-block;
          width: 6px; height: 6px; border-radius: 50%;
          background: #b8975a; margin: 0 2px;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }

        .fade-in { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-in-delay { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .quick-chip {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(184,151,90,0.3);
          background: #f9f6ef;
          color: #8a6d38;
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          letter-spacing: 0.3px;
        }
        .quick-chip:hover { background: #f3ede0; border-color: rgba(184,151,90,0.5); }
      `}</style>

      <div className="ai-root" style={{ background: "#f7f4ee" }}>

        {/* Bg glows */}
        <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(184,151,90,0.07) 0%, transparent 70%)" }} />
        <div className="fixed bottom-0 left-0 w-48 h-48 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,107,52,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-2xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="fade-in mb-10">
            <div className="ornament mb-2">✦ ✦ ✦</div>
            <h1 className="ai-title text-5xl font-light" style={{ color: "#2c2416", letterSpacing: "1px" }}>
              AI Study Assistant
            </h1>
            <div style={{ width: "56px", height: "1px", background: "linear-gradient(90deg, #b8975a, transparent)", marginTop: "12px" }} />
            <p className="mt-2 text-xs uppercase tracking-widest" style={{ color: "#9a8060", letterSpacing: "3px" }}>
              Powered by Claude
            </p>
          </div>

          {/* Input Card */}
          <div className="card relative p-7 mb-5 fade-in">
            <div className="card-top-line" />

            <div className="flex items-center justify-between mb-1">
              <h3 className="ai-title text-2xl font-light" style={{ color: "#2c2416" }}>Ask a Question</h3>
              <span className="badge">✦ Claude AI</span>
            </div>
            <div className="divider" />

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["Explain a concept", "Help me revise", "Quiz me", "Solve a problem"].map((p) => (
                <button key={p} className="quick-chip" onClick={() => setQuestion(p)}>
                  {p}
                </button>
              ))}
            </div>

            <textarea
              className="ai-textarea"
              rows="5"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && askAI()}
              placeholder="Ask anything about your studies — concepts, problems, revision, exams..."
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs" style={{ color: "#b8a07a", letterSpacing: "0.5px" }}>
                Press Ctrl + Enter to send
              </span>
              <button className="ask-btn" onClick={askAI} disabled={loading || !question.trim()}>
                {loading ? "Thinking..." : "Ask AI ✦"}
              </button>
            </div>
          </div>

          {/* Response Card */}
          <div className="card relative p-7 fade-in-delay">
            <div className="card-top-line" />

            <div className="flex items-center justify-between mb-1">
              <h3 className="ai-title text-2xl font-light" style={{ color: "#2c2416" }}>Response</h3>
              {response && <span className="badge">✦ Ready</span>}
            </div>
            <div className="divider" />

            {loading ? (
              <div className="flex items-center gap-3 py-4">
                <div className="dots">
                  <span /><span /><span />
                </div>
                <span className="text-xs" style={{ color: "#9a8060", letterSpacing: "1px" }}>
                  StudyHelper is thinking...
                </span>
              </div>
            ) : response ? (
              <p className="response-text">{response}</p>
            ) : (
              <p className="text-xs text-center py-6" style={{ color: "#c4b08a", letterSpacing: "1px" }}>
                Your answer will appear here
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default AIAssistant;