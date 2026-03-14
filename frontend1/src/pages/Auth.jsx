import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch("http://localhost:8000/api/v1/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        navigate("/dashboard");
      } else {
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("username", username);
        formData.append("password", password);
        if (avatar) formData.append("avatar", avatar);

        const res = await fetch("http://localhost:8000/api/v1/users/register", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");

        setIsLogin(true);
        setError("✓ Account created! Please sign in.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setUsername("");
    setPassword("");
    setEmail("");
    setFullName("");
    setAvatar(null);
  };

  const inputStyle = (name) => ({
    width: "100%",
    padding: "11px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 500,
    color: "#1e293b",
    background: focused === name ? "#ffffff" : "#f8fafc",
    border: `1.5px solid ${focused === name ? "#3b82f6" : "#e2e8f0"}`,
    outline: "none",
    boxShadow: focused === name ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
    boxSizing: "border-box",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Lora:wght@400;500;600&display=swap');

        .auth-root {
          font-family: 'Nunito', sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
        }

        /* Dot-grid background matching dashboard */
        .auth-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          pointer-events: none;
          z-index: 0;
        }

        .display-font { font-family: 'Lora', serif; }

        .auth-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(15,23,42,0.08), 0 1px 4px rgba(15,23,42,0.04);
          position: relative;
          z-index: 1;
        }

        /* Blue accent line at top of card */
        .auth-card::before {
          content: '';
          position: absolute;
          top: 0; left: 20px; right: 20px;
          height: 3px;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(90deg, #3b82f6, #14b8a6);
        }

        .card-float {
          animation: floatIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #ffffff;
          transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(59,130,246,0.35);
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { background: #93c5fd; cursor: not-allowed; box-shadow: none; }

        .toggle-btn {
          background: none; border: none; cursor: pointer;
          color: #3b82f6; font-weight: 700;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          transition: color 0.15s;
          padding: 0;
        }
        .toggle-btn:hover { color: #1d4ed8; }

        .forgot-btn {
          background: none; border: none; cursor: pointer;
          color: #94a3b8; font-size: 12px;
          font-family: 'Nunito', sans-serif;
          transition: color 0.15s; padding: 0;
        }
        .forgot-btn:hover { color: #3b82f6; }

        .label-style {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #64748b;
          margin-bottom: 7px;
        }

        .soft-divider { height: 1px; background: #f1f5f9; margin: 20px 0; }

        .greeting-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 999px;
          padding: 4px 14px;
          font-size: 11px; font-weight: 700; color: #1d4ed8; letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .file-input-wrap {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          color: #64748b;
          font-size: 12px;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .file-input-wrap:hover { border-color: #93c5fd; }
        .file-input-wrap::-webkit-file-upload-button {
          background: #dbeafe;
          color: #1d4ed8;
          border: none;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          letter-spacing: 0.5px;
          cursor: pointer;
          margin-right: 10px;
          transition: background 0.15s;
        }
        .file-input-wrap::-webkit-file-upload-button:hover { background: #bfdbfe; }

        /* Corner glow blobs */
        .blob-tl { position: fixed; top: -60px; left: -60px; width: 240px; height: 240px; border-radius: 50%; background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%); pointer-events: none; z-index: 0; }
        .blob-br { position: fixed; bottom: -60px; right: -60px; width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%); pointer-events: none; z-index: 0; }
      `}</style>

      <div className="auth-root flex items-center justify-center min-h-screen px-4">
        <div className="blob-tl" />
        <div className="blob-br" />

        <div className="card-float w-full" style={{ maxWidth: "420px", position: "relative", zIndex: 1 }}>
          <div className="auth-card" style={{ padding: "44px 40px 36px" }}>

            {/* Brand header */}
            <div className="text-center mb-8">
              <div className="greeting-badge mb-4">
                <span>📚</span>
                {isLogin ? "Welcome back" : "Join StudyHelper"}
              </div>
              <h1 className="display-font text-4xl font-semibold" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
                StudyHelper
              </h1>
              <p className="mt-2 text-sm" style={{ color: "#64748b" }}>
                {isLogin
                  ? "Sign in to continue your study session."
                  : "Create an account to get started."}
              </p>
            </div>

            {/* Error / success */}
            {error && (
              <div style={{
                marginBottom: "16px",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 600,
                textAlign: "center",
                color: error.startsWith("✓") ? "#15803d" : "#b91c1c",
                background: error.startsWith("✓") ? "#dcfce7" : "#fee2e2",
                border: `1px solid ${error.startsWith("✓") ? "#86efac" : "#fca5a5"}`,
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Sign up only */}
              {!isLogin && (
                <>
                  <div>
                    <label className="label-style">Full Name</label>
                    <input type="text" placeholder="Enter your full name" value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFocused("fullName")} onBlur={() => setFocused("")}
                      style={inputStyle("fullName")} />
                  </div>
                  <div>
                    <label className="label-style">Email</label>
                    <input type="email" placeholder="Enter your email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                      style={inputStyle("email")} />
                  </div>
                </>
              )}

              {/* Shared fields */}
              <div>
                <label className="label-style">Username</label>
                <input type="text" placeholder="Enter your username" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused("username")} onBlur={() => setFocused("")}
                  style={inputStyle("username")} />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                  <label className="label-style" style={{ marginBottom: 0 }}>Password</label>
                  {isLogin && (
                    <button type="button" className="forgot-btn">Forgot password?</button>
                  )}
                </div>
                <input type="password" placeholder="Enter your password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                  style={inputStyle("password")} />
              </div>

              {/* Avatar — sign up only */}
              {!isLogin && (
                <div>
                  <label className="label-style">
                    Avatar Image <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input type="file" accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="file-input-wrap" />
                  {avatar && (
                    <p style={{ marginTop: "5px", fontSize: "11px", fontWeight: 600, color: "#16a34a" }}>
                      ✓ {avatar.name}
                    </p>
                  )}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop: "4px" }}>
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="soft-divider" />

            {/* Switch mode */}
            <p className="text-center text-sm" style={{ color: "#64748b" }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={switchMode} className="toggle-btn" style={{ marginLeft: "6px" }}>
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>

          </div>

          {/* Soft shadow below card */}
          <div style={{
            position: "absolute", bottom: "-8px", left: "24px", right: "24px",
            height: "16px", borderRadius: "50%",
            background: "rgba(59,130,246,0.1)", filter: "blur(12px)", zIndex: -1,
          }} />
        </div>
      </div>
    </>
  );
}

export default Auth;