import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "⬡" },
  { to: "/progress", label: "My Progress", icon: "📊" },
  { to: "/schedule", label: "Schedule", icon: "◈" },
  { to: "/ai", label: "AI Assistant", icon: "✦" },
];

const modalOverlay = {
  position: "fixed", inset: 0, zIndex: 1000,
  background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const modalBox = {
  background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "20px",
  width: "100%", maxWidth: "420px", margin: "16px", padding: "32px",
  boxShadow: "0 24px 60px rgba(15,23,42,0.14), 0 4px 16px rgba(15,23,42,0.06)",
  fontFamily: "'Nunito', sans-serif", position: "relative",
};

const modalAccentLine = {
  position: "absolute", top: 0, left: "20px", right: "20px", height: "3px",
  borderRadius: "0 0 4px 4px", background: "linear-gradient(90deg, #3b82f6, #14b8a6)",
};

const modalTitle  = { fontFamily: "'Lora', serif", fontSize: "22px", color: "#0f172a", margin: 0, fontWeight: 600 };
const modalSub    = { color: "#64748b", fontSize: "13px", margin: "4px 0 0" };
const labelStyle  = { display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#64748b", marginBottom: "7px" };

const inputBase = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  border: "1.5px solid #e2e8f0", background: "#f8fafc",
  color: "#1e293b", fontSize: "13px", fontFamily: "'Nunito', sans-serif",
  fontWeight: 500, outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const focusedInput = { ...inputBase, border: "1.5px solid #3b82f6", background: "#ffffff", boxShadow: "0 0 0 3px rgba(59,130,246,0.12)" };

const cancelBtnStyle = {
  flex: 1, padding: "11px", borderRadius: "10px",
  background: "transparent", border: "1.5px solid #e2e8f0",
  color: "#64748b", fontSize: "13px", fontWeight: 600,
  cursor: "pointer", fontFamily: "'Nunito', sans-serif",
};

const submitBtnStyle = (loading) => ({
  flex: 1, padding: "11px", borderRadius: "10px", border: "none",
  background: loading ? "#93c5fd" : "linear-gradient(135deg, #3b82f6, #2563eb)",
  color: "#ffffff", fontSize: "13px", fontWeight: 700,
  cursor: loading ? "not-allowed" : "pointer",
  fontFamily: "'Nunito', sans-serif",
  boxShadow: loading ? "none" : "0 4px 12px rgba(59,130,246,0.3)",
});

const msgStyle = (ok) => ({
  marginBottom: "14px", padding: "10px 14px", borderRadius: "10px",
  fontSize: "12px", fontWeight: 600, textAlign: "center",
  color: ok ? "#15803d" : "#b91c1c",
  background: ok ? "#dcfce7" : "#fee2e2",
  border: `1px solid ${ok ? "#86efac" : "#fca5a5"}`,
});

// ── Notifications Modal ───────────────────────────────────────────────────────

const mockNotifications = [
  { id: 1, icon: "🔥", title: "Study Streak!", message: "You're on a 12-day streak. Keep it up!", time: "Just now", unread: true },
  { id: 2, icon: "✦", title: "AI Assistant", message: "Your quiz results are ready to review.", time: "2h ago", unread: true },
  { id: 3, icon: "📅", title: "Schedule Reminder", message: "Math revision starts in 30 minutes.", time: "3h ago", unread: false },
  { id: 4, icon: "∑", title: "Subject Update", message: "Physics notes have been updated.", time: "Yesterday", unread: false },
  { id: 5, icon: "✓", title: "Task Complete", message: "You completed 8 tasks this week!", time: "2 days ago", unread: false },
  { id: 6, icon: "📖", title: "New Material", message: "Chemistry chapter 5 notes are available.", time: "2 days ago", unread: false },
  { id: 7, icon: "🧪", title: "Quiz Reminder", message: "Biology quiz is scheduled for tomorrow.", time: "3 days ago", unread: false },
  { id: 8, icon: "⭐", title: "Achievement", message: "You earned the 'Consistent Learner' badge!", time: "4 days ago", unread: false },
  { id: 9, icon: "📊", title: "Weekly Report", message: "Your weekly progress report is ready.", time: "5 days ago", unread: false },
  { id: 10, icon: "🎯", title: "Goal Reached", message: "You hit your 25-hour study goal this week!", time: "1 week ago", unread: false },
];

function NotificationsModal({ onClose }) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div style={modalOverlay}>
      <div style={{ ...modalBox, maxWidth: "460px", padding: "0", overflow: "hidden" }}>
        <div style={modalAccentLine} />
        <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={modalTitle}>Notifications</h2>
              <p style={modalSub}>{unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up!"}</p>
            </div>
            {unreadCount > 0 && (
              <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "999px", background: "#dbeafe", color: "#1d4ed8", border: "1px solid #bfdbfe", fontWeight: 700 }}>
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ marginTop: "10px", fontSize: "11px", fontWeight: 700, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif", padding: 0 }}>
              Mark all as read
            </button>
          )}
        </div>
        <div style={{ maxHeight: "340px", overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
          {notifications.map((n, i) => (
            <div key={n.id} onClick={() => markRead(n.id)}
              style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 24px", borderBottom: i < notifications.length - 1 ? "1px solid #f8fafc" : "none", background: n.unread ? "#f0f9ff" : "#ffffff", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = n.unread ? "#e0f2fe" : "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = n.unread ? "#f0f9ff" : "#ffffff"}
            >
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0, background: n.unread ? "#dbeafe" : "#f1f5f9", border: `1px solid ${n.unread ? "#bfdbfe" : "#e2e8f0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                {n.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{n.title}</span>
                  <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 600, flexShrink: 0 }}>{n.time}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0", fontWeight: 500, lineHeight: 1.5 }}>{n.message}</p>
              </div>
              {n.unread && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3b82f6", flexShrink: 0, marginTop: "5px" }} />}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ ...cancelBtnStyle, flex: "none", padding: "10px 24px" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Other Modals ──────────────────────────────────────────────────────────────

function UpdateAvatarModal({ onClose }) {
  const { user, setUser } = useUser();
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatar(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) { setMessage("❌ Please select an image"); return; }
    setMessage(""); setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      const res = await fetch("http://localhost:8000/api/v1/users/avatar", { method: "PATCH", credentials: "include", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update avatar");
      setUser(data.data);
      setMessage("✓ Avatar updated successfully");
      setTimeout(onClose, 1500);
    } catch (err) { setMessage("❌ " + err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <div style={modalAccentLine} />
        <div style={{ marginBottom: "20px" }}>
          <h2 style={modalTitle}>Update Avatar</h2>
          <p style={modalSub}>Upload a new profile picture</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "22px" }}>
            <div style={{ width: "88px", height: "88px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #14b8a6)", border: "3px solid #bfdbfe", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", color: "#ffffff", fontFamily: "'Lora', serif" }}>
              {preview ? <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user?.fullName?.charAt(0).toUpperCase() || "?"}
            </div>
          </div>
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Choose Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ ...inputBase, cursor: "pointer", color: "#64748b" }} />
            {avatar && <p style={{ marginTop: "5px", fontSize: "11px", fontWeight: 600, color: "#16a34a" }}>✓ {avatar.name}</p>}
          </div>
          {message && <div style={msgStyle(message.startsWith("✓"))}>{message}</div>}
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={loading} style={submitBtnStyle(loading)}>{loading ? "Uploading..." : "Update Avatar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState("");
  const iStyle = (n) => focused === n ? focusedInput : inputBase;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (form.newPassword !== form.confirmPassword) { setMessage("❌ New passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/changepassword", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ oldPassword: form.oldPassword, newPassword: form.newPassword }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      setMessage("✓ Password changed successfully");
      setTimeout(onClose, 1500);
    } catch (err) { setMessage("❌ " + err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <div style={modalAccentLine} />
        <div style={{ marginBottom: "20px" }}>
          <h2 style={modalTitle}>Change Password</h2>
          <p style={modalSub}>Update your account password</p>
        </div>
        <form onSubmit={handleSubmit}>
          {[
            { label: "Current Password", key: "oldPassword", placeholder: "Enter current password" },
            { label: "New Password", key: "newPassword", placeholder: "Enter new password" },
            { label: "Confirm New Password", key: "confirmPassword", placeholder: "Confirm new password" },
          ].map(({ label, key, placeholder }) => (
            <div key={key} style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>{label}</label>
              <input type="password" value={form[key]} placeholder={placeholder}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                onFocus={() => setFocused(key)} onBlur={() => setFocused("")}
                style={iStyle(key)} />
            </div>
          ))}
          {message && <div style={msgStyle(message.startsWith("✓"))}>{message}</div>}
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={loading} style={submitBtnStyle(loading)}>{loading ? "Updating..." : "Change Password"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UpdateAccountModal({ onClose }) {
  const { user, setUser } = useUser();
  const [form, setForm] = useState({ fullName: user?.fullName || "", email: user?.email || "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState("");
  const iStyle = (n) => focused === n ? focusedInput : inputBase;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/update-account", { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ fullName: form.fullName, email: form.email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update account");
      setUser(data.data);
      setMessage("✓ Account updated successfully");
      setTimeout(onClose, 1500);
    } catch (err) { setMessage("❌ " + err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <div style={modalAccentLine} />
        <div style={{ marginBottom: "20px" }}>
          <h2 style={modalTitle}>Update Account</h2>
          <p style={modalSub}>Update your name and email</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={form.fullName} placeholder="Enter your full name"
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              onFocus={() => setFocused("fullName")} onBlur={() => setFocused("")}
              style={iStyle("fullName")} />
          </div>
          <div style={{ marginBottom: "6px" }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} placeholder="Enter your email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
              style={iStyle("email")} />
          </div>
          {message && <div style={{ ...msgStyle(message.startsWith("✓")), marginTop: "12px" }}>{message}</div>}
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={loading} style={submitBtnStyle(loading)}>{loading ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showUpdateAccount, setShowUpdateAccount] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showUpdateAvatar, setShowUpdateAvatar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await fetch("http://localhost:8000/api/v1/users/logout", { method: "POST", credentials: "include" });
    setUser(null);
    navigate("/");
  };

  const closeAll = () => { setDropdownOpen(false); setSettingsOpen(false); };

  const AvatarDisplay = ({ size = 32, fontSize = 14 }) => (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lora', serif", fontSize, color: "#ffffff", fontWeight: 600, flexShrink: 0, overflow: "hidden" }}>
      {user?.avatar
        ? <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : user?.fullName?.charAt(0).toUpperCase() || "?"}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Lora:wght@400;500;600&display=swap');

        .navbar {
          font-family: 'Nunito', sans-serif;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 8px rgba(15,23,42,0.06);
          position: sticky; top: 0; z-index: 100;
        }
        .navbar-accent {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #3b82f6, #14b8a6);
        }
        .navbar-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 28px;
          display: flex; align-items: center; justify-content: space-between; height: 64px;
        }

        .navbar-brand {
          font-family: 'Lora', serif; font-size: 20px; font-weight: 600;
          color: #0f172a; text-decoration: none; letter-spacing: -0.3px;
          display: flex; align-items: center; gap: 10px; transition: opacity 0.2s;
        }
        .navbar-brand:hover { opacity: 0.75; }
        .brand-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #3b82f6, #14b8a6);
          border-radius: 9px; display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: #ffffff;
          box-shadow: 0 2px 8px rgba(59,130,246,0.3);
        }

        .nav-links {
          display: flex; align-items: center; gap: 2px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 12px; padding: 4px;
        }
        .nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 8px;
          text-decoration: none; font-size: 13px; font-weight: 600;
          color: #64748b; letter-spacing: 0.2px;
          transition: color 0.15s, background 0.15s; white-space: nowrap;
        }
        .nav-link:hover { color: #1e293b; background: #ffffff; }
        .nav-link.active {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #ffffff; box-shadow: 0 2px 8px rgba(59,130,246,0.3);
        }
        .nav-link.active .nav-icon, .nav-link:hover .nav-icon { opacity: 0.9; }
        .nav-icon { font-size: 12px; opacity: 0.4; transition: opacity 0.15s; }
        .nav-divider { width: 1px; height: 14px; background: #e2e8f0; margin: 0 2px; }
        .nav-badge {
          font-size: 9px; padding: 1px 6px; border-radius: 999px;
          background: #dbeafe; color: #1d4ed8;
          border: 1px solid #bfdbfe; letter-spacing: 0.5px; font-weight: 700;
        }

        .account-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 5px 12px 5px 5px;
          background: #f8fafc; border: 1.5px solid #e2e8f0;
          border-radius: 999px; cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; position: relative;
        }
        .account-btn:hover { background: #eff6ff; border-color: #93c5fd; box-shadow: 0 2px 10px rgba(59,130,246,0.1); }
        .account-btn.open { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .account-name { font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1; }
        .account-role { font-size: 10px; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1; margin-top: 2px; }
        .account-chevron { font-size: 9px; color: #94a3b8; transition: transform 0.25s; margin-left: 2px; }
        .account-chevron.open { transform: rotate(180deg); }
        .online-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; border: 2px solid #ffffff; position: absolute; bottom: 0; right: 0; }

        .dropdown {
          position: absolute; top: calc(100% + 10px); right: 0; width: 272px;
          background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;
          box-shadow: 0 16px 48px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06);
          overflow: hidden; animation: dropIn 0.2s cubic-bezier(0.16,1,0.3,1) both;
          z-index: 200; max-height: 500px; overflow-y: auto;
          scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent;
        }
        .dropdown::-webkit-scrollbar { width: 4px; }
        .dropdown::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-accent { height: 3px; background: linear-gradient(90deg, #3b82f6, #14b8a6); }
        .dropdown-header {
          padding: 16px 18px 14px; display: flex; align-items: center; gap: 12px;
          border-bottom: 1px solid #f1f5f9; background: #f8fafc;
        }
        .dropdown-username { font-family: 'Lora', serif; font-size: 16px; color: #0f172a; font-weight: 600; line-height: 1.2; }
        .dropdown-email { font-size: 11px; color: #94a3b8; margin-top: 2px; }

        .dropdown-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid #f1f5f9; }
        .stat-cell { padding: 12px 8px; text-align: center; border-right: 1px solid #f1f5f9; }
        .stat-cell:last-child { border-right: none; }
        .stat-val { font-family: 'Lora', serif; font-size: 18px; color: #3b82f6; line-height: 1; font-weight: 600; }
        .stat-lbl { font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; font-weight: 700; }

        .dropdown-menu { padding: 6px; }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 8px;
          font-size: 13px; color: #475569; font-weight: 600;
          cursor: pointer; transition: background 0.15s, color 0.15s;
          border: none; background: none; width: 100%; text-align: left;
          font-family: 'Nunito', sans-serif; text-decoration: none;
        }
        .dropdown-item:hover { background: #f0f9ff; color: #1e293b; }
        .dropdown-item.danger:hover { background: #fef2f2; color: #dc2626; }
        .dropdown-item-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0; transition: background 0.15s, border-color 0.15s;
        }
        .dropdown-item:hover .dropdown-item-icon { background: #dbeafe; border-color: #bfdbfe; }
        .dropdown-item.danger:hover .dropdown-item-icon { background: #fee2e2; border-color: #fca5a5; }
        .dropdown-divider { height: 1px; background: #f1f5f9; margin: 4px 6px; }
      `}</style>

      <nav className="navbar" style={{ position: "relative" }}>
        <div className="navbar-accent" />
        <div className="navbar-inner">

          <Link to="/dashboard" className="navbar-brand">
            <div className="brand-icon">📚</div>
            StudyHelper
          </Link>

          {/* Nav links: Dashboard → My Progress → Schedule → AI Assistant */}
          <div className="nav-links">
            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.to;
              return (
                <div key={link.to} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && !isActive && location.pathname !== navLinks[i - 1]?.to && <div className="nav-divider" />}
                  <Link to={link.to} className={`nav-link ${isActive ? "active" : ""}`}>
                    <span className="nav-icon">{link.icon}</span>
                    {link.label}
                    {link.to === "/ai" && !isActive && <span className="nav-badge">AI</span>}
                  </Link>
                </div>
              );
            })}
          </div>

          <div style={{ position: "relative" }}>
            <button className={`account-btn ${dropdownOpen ? "open" : ""}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div style={{ position: "relative" }}>
                <AvatarDisplay size={32} fontSize={14} />
                <div className="online-dot" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="account-name">{user?.fullName || "Loading..."}</div>
                <div className="account-role">Student</div>
              </div>
              <span className={`account-chevron ${dropdownOpen ? "open" : ""}`}>▼</span>
            </button>

            {dropdownOpen && (
              <div className="dropdown">
                <div className="dropdown-accent" />

                <div className="dropdown-header">
                  <AvatarDisplay size={44} fontSize={18} />
                  <div>
                    <div className="dropdown-username">{user?.fullName}</div>
                    <div className="dropdown-email">{user?.email}</div>
                    <div style={{ marginTop: "6px" }}>
                      <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "999px", background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", letterSpacing: "0.5px", fontWeight: 700 }}>
                        ● Online
                      </span>
                    </div>
                  </div>
                </div>

                <div className="dropdown-stats">
                  {[{ val: "12", lbl: "Streak" }, { val: "4", lbl: "Subjects" }, { val: "18h", lbl: "This Week" }].map((s) => (
                    <div key={s.lbl} className="stat-cell">
                      <div className="stat-val">{s.val}</div>
                      <div className="stat-lbl">{s.lbl}</div>
                    </div>
                  ))}
                </div>

                {/* Dropdown menu: Profile → Notifications → Subjects → Settings → Sign Out */}
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={closeAll}>
                    <div className="dropdown-item-icon">◈</div>
                    My Profile
                  </Link>

                  <button className="dropdown-item" onClick={() => { closeAll(); setShowNotifications(true); }}>
                    <div className="dropdown-item-icon">🔔</div>
                    Notifications
                  </button>

                  <Link to="/subjects" className="dropdown-item" onClick={closeAll}>
                    <div className="dropdown-item-icon">∑</div>
                    Subjects
                  </Link>

                  <div style={{ position: "relative" }}>
                    <button className="dropdown-item" onClick={() => setSettingsOpen(!settingsOpen)}>
                      <div className="dropdown-item-icon">⚙</div>
                      Settings
                      <span style={{ marginLeft: "auto", fontSize: "10px", color: "#94a3b8", transform: settingsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
                    </button>

                    {settingsOpen && (
                      <div style={{ margin: "2px 0 2px 12px", borderLeft: "2px solid #dbeafe", paddingLeft: "8px" }}>
                        <button className="dropdown-item" onClick={() => { closeAll(); setShowUpdateAccount(true); }}>
                          <div className="dropdown-item-icon">◈</div>
                          Update Account
                        </button>
                        <button className="dropdown-item" onClick={() => { closeAll(); setShowChangePassword(true); }}>
                          <div className="dropdown-item-icon">🔑</div>
                          Change Password
                        </button>
                        <button className="dropdown-item" onClick={() => { closeAll(); setShowUpdateAvatar(true); }}>
                          <div className="dropdown-item-icon">✏️</div>
                          Update Avatar
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="dropdown-divider" />

                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <div className="dropdown-item-icon">↩</div>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {dropdownOpen && <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setDropdownOpen(false)} />}
      {showUpdateAccount && <UpdateAccountModal onClose={() => setShowUpdateAccount(false)} />}
      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
      {showUpdateAvatar && <UpdateAvatarModal onClose={() => setShowUpdateAvatar(false)} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
    </>
  );
}

export default Navbar;
