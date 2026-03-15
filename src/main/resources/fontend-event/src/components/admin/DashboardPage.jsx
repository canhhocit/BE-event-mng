import { useState, useEffect } from "react";
import { StatusBadge } from "../../utils/helpers";

export default function DashboardPage({ api }) {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/events?page=1&size=100"),
      api.get("/users?page=1&size=100"),
    ]).then(([evRes, usRes]) => {
      setEvents(evRes.result?.content ?? []);
      setUsers(usRes.result?.content ?? []);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = [
    { label: "Tổng sự kiện",  value: events.length,                                    color: "primary", icon: "📅" },
    { label: "Đang mở bán",   value: events.filter((e) => e.status === "PUBLISHED").length, color: "success", icon: "✅" },
    { label: "Người dùng",    value: users.length,                                     color: "info",    icon: "👥" },
    { label: "Ban tổ chức",   value: users.filter((u) => u.role === "ORGANIZER").length, color: "warning", icon: "🏢" },
  ];

  return (
    <>
      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div className="col-6 col-xl-3" key={s.label}>
            <div className={`card border-0 shadow-sm h-100 border-start border-4 border-${s.color}`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">{s.label}</p>
                  <h4 className="mb-0 fw-bold">{loading ? "…" : s.value}</h4>
                </div>
                <span style={{ fontSize: 28 }}>{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bảng sự kiện gần đây */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white fw-semibold border-bottom">📋 Sự kiện gần đây</div>
        {loading ? (
          <div className="text-center py-4 text-muted">Đang tải...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th><th>Tên sự kiện</th><th>Danh mục</th>
                  <th>Ban tổ chức</th><th>Ngày bắt đầu</th><th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 8).map((ev, i) => (
                  <tr key={ev.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td className="fw-semibold">{ev.name}</td>
                    <td>{ev.categoryName ?? "—"}</td>
                    <td>{ev.organizerName ?? "—"}</td>
                    <td>{ev.startTime?.slice(0, 10) ?? "—"}</td>
                    <td><StatusBadge status={ev.status} /></td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-muted py-3">Chưa có sự kiện.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}