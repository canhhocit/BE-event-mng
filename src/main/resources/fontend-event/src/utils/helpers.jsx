// Format tiền VNĐ
export const VND = (n) =>
  n == null
    ? "—"
    : Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// Badge màu theo role
export function RoleBadge({ role }) {
  const map = { ADMIN: "danger", ORGANIZER: "warning", CUSTOMER: "primary" };
  return <span className={`badge bg-${map[role] ?? "secondary"}`}>{role}</span>;
}

// Badge màu theo status
export function StatusBadge({ status }) {
  const map = {
    PUBLISHED: "success",
    DRAFT: "secondary",
    CANCELLED: "danger",
    COMPLETED: "info",
    CONFIRMED: "success",
    PENDING: "warning",
    PAID: "success",
    FAILED: "danger",
  };
  return <span className={`badge bg-${map[status] ?? "secondary"}`}>{status}</span>;
}

// Component phân trang dùng chung
export function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="card-footer bg-white d-flex justify-content-between align-items-center">
      <small className="text-muted">Trang {page} / {totalPages}</small>
      <div>
        <button
          className="btn btn-sm btn-outline-secondary me-1"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹ Trước
        </button>
        <button
          className="btn btn-sm btn-outline-secondary"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Sau ›
        </button>
      </div>
    </div>
  );
}