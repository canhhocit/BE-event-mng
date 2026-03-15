import { useState, useEffect } from "react";
import { RoleBadge, Pagination } from "../../utils/helpers";

export default function UsersPage({ api }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [refetch, setRefetch] = useState(0); // trigger reload sau khi khóa

  useEffect(() => {
    setLoading(true);
    api.get(`/users?page=${page}&size=10`).then((res) => {
      setUsers(res.result?.content ?? []);
      setTotalPages(res.result?.totalPages ?? 1);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, refetch]);

  const handleDisable = async (username) => {
    if (!window.confirm(`Khóa tài khoản "${username}"?`)) return;
    setDeleting(username);
    await api.del(`/users/${username}`);
    setDeleting(null);
    setRefetch((n) => n + 1); // trigger useEffect reload
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.fullName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white d-flex justify-content-between align-items-center border-bottom">
        <span className="fw-semibold">👥 Danh sách Người dùng</span>
        <input
          className="form-control form-control-sm w-auto"
          placeholder="Tìm theo username / họ tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-4 text-muted">Đang tải...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th><th>Username</th><th>Họ tên</th>
                <th>Email</th><th>SĐT</th><th>Vai trò</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="text-muted">#{u.id}</td>
                  <td className="fw-semibold">@{u.username}</td>
                  <td>{u.fullName ?? "—"}</td>
                  <td>{u.email ?? "—"}</td>
                  <td>{u.phone ?? "—"}</td>
                  <td><RoleBadge role={u.role} /></td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={deleting === u.username || u.role === "ADMIN"}
                      onClick={() => handleDisable(u.username)}
                    >
                      {deleting === u.username ? "…" : "Khóa"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-3 text-muted">Không có kết quả.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}