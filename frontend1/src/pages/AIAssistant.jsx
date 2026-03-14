import { useState, useRef} from "react";

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [pdfId, setPdfId] = useState(null);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const askAI = async () => {
  if (!question.trim()) return;
  setLoading(true);
  setResponse("");

  try {
    const res = await fetch("http://localhost:8000/api/v1/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
      message: question,
      chatId: chatId,
      pdfId: pdfId
      })
    });
    const data = await res.json();
    setResponse(data.data?.reply || "No response received.");
    if (!chatId) {
      setChatId(data.data.chatId);
    }
  } 
  catch {
    setResponse("Connection error. Please try again.");
  }

  setLoading(false);
};


const uploadPDF = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("pdf", file);

    const res = await fetch("http://localhost:8000/api/v1/pdf/upload", {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const data = await res.json();
    if (data.success) {
      setPdfId(data.pdfId);
      setPdfUploaded(true);
    } else {
      alert("❌ Upload failed: " + data.message);
    }
  } catch {
    alert("❌ Connection error during PDF upload.");
  }
};

const handleUploadClick = () => {
  fileInputRef.current.click();
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Lora:wght@400;500;600&display=swap');

        .ai-root {
          font-family: 'Nunito', sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
        }

        .ai-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          pointer-events: none;
          z-index: 0;
        }

        .ai-content { position: relative; z-index: 1; }

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

        .ai-textarea {
          width: 100%;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
          resize: none;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
          line-height: 1.6;
        }
        .ai-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
          background: #ffffff;
        }
        .ai-textarea::placeholder { color: #94a3b8; }

        .ask-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 11px 28px;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }
        .ask-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(59,130,246,0.35); }
        .ask-btn:active { transform: translateY(0); }
        .ask-btn:disabled { background: #93c5fd; box-shadow: none; cursor: not-allowed; transform: none; }

        .quick-chip {
          padding: 6px 14px;
          border-radius: 999px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          font-size: 12px;
          font-family: 'Nunito', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .quick-chip:hover {
          background: #eff6ff;
          border-color: #93c5fd;
          color: #1d4ed8;
        }

        .pill {
          font-size: 11px; font-weight: 700; padding: 2px 10px;
          border-radius: 999px; letter-spacing: 0.3px;
        }
        .pill-blue { background: #dbeafe; color: #1d4ed8; }
        .pill-teal { background: #ccfbf1; color: #0f766e; }
        .pill-green { background: #dcfce7; color: #15803d; }

        .soft-divider { height: 1px; background: #f1f5f9; margin: 14px 0; }

        .response-text {
          font-size: 13px;
          line-height: 1.9;
          color: #334155;
          white-space: pre-wrap;
          font-family: 'Nunito', sans-serif;
          font-weight: 500;
        }

        .dots span {
          display: inline-block;
          width: 7px; height: 7px; border-radius: 50%;
          background: #3b82f6; margin: 0 2px;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40% { transform: translateY(-7px); opacity: 1; }
        }

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

      <div className="ai-root">
        <div className="ai-content max-w-2xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="fade-up mb-8">
            <div className="greeting-badge mb-4">
              <span>🤖</span> Powered by Claude
            </div>
            <h1 className="display-font text-4xl font-semibold" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
              AI Study Assistant
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
              Ask anything — concepts, problems, revision, exam prep.
            </p>
          </div>

          {/* Input Card */}
          <div className="study-card accent-blue p-6 mb-5 fade-up delay-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="display-font text-xl font-semibold" style={{ color: "#0f172a" }}>Ask a Question</h3>
              <span className="pill pill-blue">✦ Claude AI</span>
            </div>
            <div className="soft-divider" />

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: "💡 Explain a concept", value: "Explain a concept" },
                { label: "📖 Help me revise", value: "Help me revise" },
                { label: "🧪 Quiz me", value: "Quiz me" },
                { label: "🔢 Solve a problem", value: "Solve a problem" },
              ].map((p) => (
                <button key={p.value} className="quick-chip" onClick={() => setQuestion(p.value)}>
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: "12px" }}>
              <button
                onClick={handleUploadClick}
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
                  transition: "all 0.2s",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "13px",
                }}
              >
                {pdfUploaded ? "✅ PDF Uploaded" : "📄 Upload PDF"}
              </button>

              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={uploadPDF}
              />
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
              <span className="text-xs font-semibold" style={{ color: "#94a3b8" }}>
                Press Ctrl + Enter to send
              </span>
              <button className="ask-btn" onClick={askAI} disabled={loading || !question.trim()}>
                {loading ? "Thinking..." : "Ask AI ✦"}
              </button>
            </div>
          </div>

          {/* Response Card */}
          <div className="study-card accent-teal p-6 fade-up delay-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="display-font text-xl font-semibold" style={{ color: "#0f172a" }}>Response</h3>
              {response && !loading && <span className="pill pill-green">✓ Ready</span>}
              {loading && <span className="pill pill-blue">Generating...</span>}
            </div>
            <div className="soft-divider" />

            {loading ? (
              <div className="flex items-center gap-3 py-5">
                <div className="dots">
                  <span /><span /><span />
                </div>
                <span className="text-sm font-semibold" style={{ color: "#64748b" }}>
                  StudyHelper is thinking...
                </span>
              </div>
            ) : response ? (
              <p className="response-text">{response}</p>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <span style={{ fontSize: "32px" }}>💬</span>
                <p className="text-sm font-semibold text-center" style={{ color: "#94a3b8" }}>
                  Your answer will appear here
                </p>
                <p className="text-xs text-center" style={{ color: "#cbd5e1" }}>
                  Ask a question above to get started
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default AIAssistant;