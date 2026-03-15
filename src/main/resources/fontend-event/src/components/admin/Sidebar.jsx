import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MENU = [
  { key: "dashboard",  label: "Tổng quan",   icon: "📊" },
  { key: "events",     label: "Sự kiện",      icon: "📅" },
  { key: "users",      label: "Người dùng",   icon: "👥" },
  { key: "categories", label: "Danh mục",     icon: "📁" },
  { key: "orders",     label: "Đơn hàng",     icon: "🧾" },
];

export default function Sidebar({ active, onSelect }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="d-flex flex-column bg-dark text-white"
      style={{ width: open ? 220 : 60, minHeight: "100vh", transition: "width 0.2s", flexShrink: 0 }}
    >
      {/* Logo */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary" style={{ minHeight: 64 }}>
        {open && (
          <div>
            <div className="fw-bold" style={{ fontSize: 15 }}>🎟 EVENT MNG</div>
            <small className="text-secondary" style={{ fontSize: 11 }}>Admin Panel</small>
          </div>
        )}
        <button className="btn btn-sm btn-dark ms-auto" onClick={() => setOpen((v) => !v)}>
          {open ? "◀" : "▶"}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-grow-1 py-2 px-2">
        {MENU.map((m) => (
          <button
            key={m.key}
            onClick={() => onSelect(m.key)}
            className={`btn w-100 text-start mb-1 d-flex align-items-center gap-2 ${
              active === m.key ? "btn-primary" : "btn-dark"
            }`}
            style={{ fontSize: 14, borderRadius: 8 }}
            title={!open ? m.label : undefined}
          >
            <span>{m.icon}</span>
            {open && <span>{m.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-top border-secondary">
        {open && <div className="small text-secondary mb-2 text-truncate">👤 {user?.sub ?? "Admin"}</div>}
        <button
          className={`btn btn-outline-danger btn-sm ${open ? "w-100" : ""}`}
          onClick={handleLogout}
          title="Đăng xuất"
        >
          {open ? "Đăng xuất" : "✕"}
        </button>
      </div>
    </div>
  );
}

export { MENU };