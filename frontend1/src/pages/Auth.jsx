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
        // --- SIGN IN ---
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
        // --- SIGN UP ---
        // if (!avatar) {
        //   setError("Avatar image is required");
        //   setLoading(false);
        //   return;
        // }

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
    background: focused === name ? "#fffef9" : "#f9f6ef",
    border: `1px solid ${focused === name ? "#b8975a" : "rgba(184,151,90,0.3)"}`,
    color: "#2c2416",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "13px",
  });

  const labelStyle = {
    color: "#7a6040",
    letterSpacing: "2px",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500&display=swap');

        .auth-root { font-family: 'Montserrat', sans-serif; }
        .auth-title { font-family: 'Cormorant Garamond', serif; }

        .card-float {
          animation: floatIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .input-field { transition: border-color 0.25s, box-shadow 0.25s, background 0.25s; }
        .input-field:focus {
          outline: none;
          border-color: #b8975a;
          box-shadow: 0 0 0 3px rgba(184,151,90,0.13);
          background: #fffef9;
        }

        .submit-btn {
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 2px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #8a6d38;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(139,107,52,0.28);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0px); }

        .toggle-btn { transition: color 0.2s; letter-spacing: 0.5px; }
        .toggle-btn:hover { color: #8a6d38; }

        .divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, #d4c4a0, transparent);
        }

        .bg-pattern {
          background-image:
            radial-gradient(circle at 20% 50%, rgba(184,151,90,0.07) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139,107,52,0.06) 0%, transparent 40%),
            radial-gradient(circle at 60% 80%, rgba(200,175,120,0.05) 0%, transparent 40%);
        }

        .ornament {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          color: #b8975a;
          opacity: 0.6;
          letter-spacing: 8px;
        }

        .file-input::-webkit-file-upload-button {
          background: linear-gradient(135deg, #b8975a, #8a6d38);
          color: #fff8ee;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 1px;
          cursor: pointer;
          margin-right: 10px;
        }
      `}</style>

      <div
        className="auth-root flex items-center justify-center min-h-screen bg-pattern"
        style={{ background: "#f7f4ee" }}
      >
        <div className="fixed top-0 left-0 w-40 h-40 opacity-20"
          style={{ background: "radial-gradient(circle, #b8975a 0%, transparent 70%)" }} />
        <div className="fixed bottom-0 right-0 w-56 h-56 opacity-15"
          style={{ background: "radial-gradient(circle, #8a6d38 0%, transparent 70%)" }} />

        <div className="card-float relative w-full mx-4" style={{ maxWidth: "420px" }}>
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: "rgba(255,253,247,0.92)",
              border: "1px solid rgba(184,151,90,0.25)",
              boxShadow: "0 24px 64px rgba(100,80,40,0.12), 0 4px 16px rgba(100,80,40,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
              padding: "48px 44px 40px",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #b8975a, transparent)" }} />

            {/* Brand */}
            <div className="text-center mb-8">
              <div className="ornament mb-3">✦ ✦ ✦</div>
              <h1 className="auth-title text-5xl font-light tracking-wide"
                style={{ color: "#2c2416", letterSpacing: "1px" }}>
                StudyHelper
              </h1>
              <div className="mx-auto mt-3"
                style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, transparent, #b8975a, transparent)" }} />
              <p className="mt-3 text-xs uppercase tracking-widest"
                style={{ color: "#b8975a", letterSpacing: "3px" }}>
                {isLogin ? "Welcome back" : "Create your account"}
              </p>
            </div>

            {/* Error / Success message */}
            {error && (
              <div className="mb-4 py-2 px-3 rounded-lg text-xs text-center"
                style={{
                  color: error.startsWith("✓") ? "#5a7a40" : "#c0392b",
                  background: error.startsWith("✓") ? "#f4fff0" : "#fff4f4",
                  border: `1px solid ${error.startsWith("✓") ? "#b8d4a8" : "#f5c6c6"}`,
                  fontFamily: "'Montserrat', sans-serif",
                }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── SIGN UP ONLY FIELDS ── */}
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 font-medium" style={labelStyle}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFocused("fullName")}
                      onBlur={() => setFocused("")}
                      className="input-field w-full px-4 py-3 rounded-xl"
                      style={inputStyle("fullName")}
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 font-medium" style={labelStyle}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused("")}
                      className="input-field w-full px-4 py-3 rounded-xl"
                      style={inputStyle("email")}
                    />
                  </div>
                </>
              )}

              {/* ── SHARED FIELDS ── */}
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 font-medium" style={labelStyle}>
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused("username")}
                  onBlur={() => setFocused("")}
                  className="input-field w-full px-4 py-3 rounded-xl"
                  style={inputStyle("username")}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 font-medium" style={labelStyle}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  className="input-field w-full px-4 py-3 rounded-xl"
                  style={inputStyle("password")}
                />
              </div>

              {/* ── SIGN UP ONLY — Avatar ── */}
              {!isLogin && (
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 font-medium" style={labelStyle}>
                    Avatar Image <span style={{ color: "#c0392b" }}>*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="file-input w-full text-xs rounded-xl px-3 py-2"
                    style={{
                      background: "#f9f6ef",
                      border: "1px solid rgba(184,151,90,0.3)",
                      color: "#7a6040",
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  />
                  {avatar && (
                    <p className="mt-1 text-xs" style={{ color: "#7a9a60" }}>
                      ✓ {avatar.name}
                    </p>
                  )}
                </div>
              )}

              {/* ── SIGN IN ONLY — Forgot password ── */}
              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-xs toggle-btn"
                    style={{ color: "#b8975a", fontFamily: "'Montserrat', sans-serif" }}>
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="submit-btn w-full py-3 rounded-xl text-xs font-medium uppercase mt-2"
                style={{
                  background: loading
                    ? "#c8b48a"
                    : "linear-gradient(135deg, #b8975a, #8a6d38)",
                  color: "#fff8ee",
                  letterSpacing: "3px",
                  fontFamily: "'Montserrat', sans-serif",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading
                  ? "Please wait..."
                  : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="divider-line" />
              <span className="text-xs" style={{ color: "#b8a080", letterSpacing: "2px" }}>or</span>
              <div className="divider-line" />
            </div>

            <p className="text-center text-xs" style={{ color: "#9a8060" }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={switchMode}
                className="toggle-btn ml-2 font-medium"
                style={{ color: "#b8975a", fontFamily: "'Montserrat', sans-serif" }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>

            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #b8975a40, transparent)" }} />
          </div>

          <div className="absolute -bottom-3 left-8 right-8 h-6 rounded-full -z-10"
            style={{ background: "rgba(184,151,90,0.15)", filter: "blur(12px)" }} />
        </div>
      </div>
    </>
  );
}

export default Auth;