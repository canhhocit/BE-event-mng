import { useState, useEffect } from "react";

export default function CategoriesPage({ api }) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [refetch, setRefetch] = useState(0);

  // form dùng chung cho cả Tạo mới và Sửa
  const EMPTY = { id: null, name: "", description: "" };
  const [form, setForm] = useState(EMPTY);
  const isEditing = form.id !== null;

  // ── Load danh sách ─────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    api.get("/categories").then((res) => {
      setCats(res.result ?? []);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  // ── Submit form (tạo mới hoặc cập nhật) ───────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: "", type: "" });

    const body = { name: form.name, description: form.description };
    const res = isEditing
      ? await api.put(`/categories/${form.id}`, body)
      : await api.post("/categories", body);

    setSaving(false);

    if (res.code === 1000) {
      setMsg({ text: isEditing ? "✅ Cập nhật thành công!" : "✅ Tạo danh mục thành công!", type: "success" });
      setForm(EMPTY);
      setRefetch((n) => n + 1);
    } else {
      setMsg({ text: `❌ ${res.message}`, type: "danger" });
    }
  };

  // ── Xóa ───────────────────────────────────────────────────────────────────
  const handleDelete = async (cat) => {
    if (!window.confirm(`Xóa danh mục "${cat.name}"?`)) return;
    const res = await api.del(`/categories/${cat.id}`);
    if (res.code === 1000 || res.status === 200) {
      setMsg({ text: "✅ Đã xóa danh mục.", type: "success" });
      setRefetch((n) => n + 1);
    } else {
      setMsg({ text: `❌ ${res.message}`, type: "danger" });
    }
  };

  const filtered = cats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card border-0 shadow-sm">
      {/*FORM TẠO / SỬA */}
      <div className="card-body border-bottom pb-4">
        {msg.text && (
          <div className={`alert alert-${msg.type} py-2 mb-3`}>{msg.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row align-items-start g-3">
            {/* Tên danh mục */}
            <div className="col-12 col-md-5">
              <div className="mb-3">
                <label className="form-label fw-semibold">Tên danh mục</label>
                <input
                  className="form-control"
                  placeholder="Nhập tên danh mục..."
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  minLength={5}
                />
              </div>

              <div>
                <label className="form-label fw-semibold">Mô tả</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Nhập mô tả..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Nút xác nhận */}
            <div className="col-12 col-md-2 d-flex flex-column gap-2 pt-md-4 mt-md-2">
              <button className="btn btn-warning fw-semibold" disabled={saving}>
                {saving ? "Đang lưu..." : isEditing ? "Cập nhật" : "Xác nhận"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setForm(EMPTY)}
                >
                  Hủy sửa
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* ── DANH SÁCH ───────────────────────────────────────────────────── */}
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-semibold">Danh sách các danh mục</span>
          <div className="d-flex align-items-center gap-2">
            <label className="mb-0 text-muted small">Tìm kiếm</label>
            <input
              className="form-control form-control-sm"
              style={{ width: 200 }}
              placeholder="Tên danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4 text-muted">Đang tải...</div>
        ) : (
          <table className="table table-bordered align-middle mb-0">
            <thead className="table-light text-center">
              <tr>
                <th style={{ width: "25%" }}>Tên danh mục</th>
                <th>Mô tả</th>
                <th style={{ width: "15%" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="text-center">
                    <span className="border rounded px-2 py-1">{c.name}</span>
                  </td>
                  <td className="text-muted">{c.description || "—"}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setForm({ id: c.id, name: c.name, description: c.description ?? "" });
                        setMsg({ text: "", type: "" });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(c)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-3">
                    Không có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}