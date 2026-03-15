import { useState, useEffect, useRef } from "react";
import { StatusBadge, Pagination } from "../../utils/helpers";

// ── Modal Chi tiết ──────────────────────────────────────────────────────────
function EventDetailModal({ event, onClose }) {
  if (!event) return null;
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3 shadow-lg"
        style={{ width: 480, maxHeight: "85vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {event.imageUrls?.[0] ? (
          <img src={event.imageUrls[0]} alt={event.name}
            className="w-100 rounded-top" style={{ height: 220, objectFit: "cover" }} />
        ) : (
          <div className="w-100 rounded-top bg-secondary d-flex align-items-center justify-content-center text-white"
            style={{ height: 220 }}>Không có ảnh</div>
        )}
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 className="fw-bold mb-0">{event.name}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <table className="table table-borderless table-sm mb-0">
            <tbody>
              {[
                ["Địa điểm",          event.location ?? "—"],
                ["Thời gian bắt đầu", event.startTime?.replace("T", " ") ?? "—"],
                ["Thời gian kết thúc", event.endTime?.replace("T", " ") ?? "—"],
                ["Danh mục",          event.categoryName ?? "—"],
                ["Ban tổ chức",       event.organizerName ?? "—"],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td className="text-muted" style={{ width: "45%" }}>{label}</td>
                  <td>{val}</td>
                </tr>
              ))}
              <tr>
                <td className="text-muted">Số vé đã bán / tổng vé</td>
                <td>
                  {event.ticketTypes?.length > 0
                    ? event.ticketTypes.map((tt) => (
                        <div key={tt.id} className="small">
                          {tt.name}: {tt.totalQuantity - tt.remainingQuantity} / {tt.totalQuantity}
                        </div>
                      ))
                    : "—"}
                </td>
              </tr>
              <tr>
                <td className="text-muted">Trạng thái</td>
                <td><StatusBadge status={event.status} /></td>
              </tr>
              {event.description && (
                <tr>
                  <td className="text-muted">Mô tả</td>
                  <td className="small">{event.description}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Dropdown Tùy chỉnh ──────────────────────────────────────────────────────
function ActionDropdown({ event, onChangeStatus, loading }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Chỉ hiện với sự kiện chưa được duyệt hoặc chưa bị hủy
  if (event.status === "PUBLISHED" || event.status === "CANCELLED") return null;

  const handle = (newStatus) => {
    setOpen(false);
    onChangeStatus(event, newStatus);
  };

  return (
    <div ref={ref} style={{ position: "relative", flex: 1 }}>
      <button
        className="btn btn-sm btn-outline-secondary w-100"
        style={{ fontSize: 12 }}
        disabled={loading}
        onClick={() => setOpen((v) => !v)}
      >
        {loading ? "…" : "Tùy chỉnh ▾"}
      </button>

      {open && (
        <div
          className="bg-white border rounded shadow-sm"
          style={{ position: "absolute", bottom: "110%", left: 0, right: 0, zIndex: 100, minWidth: 130 }}
        >
          <button
            className="btn btn-sm w-100 text-start px-3 py-2 text-success"
            onClick={() => handle("PUBLISHED")}
          >
            ✅ Duyệt (Publish)
          </button>
          <hr className="my-0" />
          <button
            className="btn btn-sm w-100 text-start px-3 py-2 text-danger"
            onClick={() => handle("CANCELLED")}
          >
            ❌ Từ chối
          </button>
        </div>
      )}
    </div>
  );
}

// ── Card sự kiện ────────────────────────────────────────────────────────────
function EventCard({ event, onDetail, onChangeStatus, changingId }) {
  return (
    <div className="card h-100 border shadow-sm" style={{ borderRadius: 10, overflow: "hidden" }}>
      <div style={{ position: "relative", height: 150 }}>
        {event.imageUrls?.[0] ? (
          <img src={event.imageUrls[0]} alt={event.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center text-white small">
            Không có ảnh
          </div>
        )}
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <StatusBadge status={event.status} />
        </div>
      </div>

      <div className="card-body p-2 d-flex flex-column gap-1">
        <p className="mb-0 fw-semibold"
          style={{ fontSize: 13, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {event.name}
        </p>
        <p className="mb-0 text-muted" style={{ fontSize: 11 }}>{event.organizerName ?? "—"}</p>
        <p className="mb-0 text-muted" style={{ fontSize: 11 }}>{event.startTime?.slice(0, 10) ?? "—"}</p>

        <div className="d-flex gap-1 mt-auto pt-1">
          <button
            className="btn btn-sm btn-outline-primary flex-fill"
            style={{ fontSize: 12 }}
            onClick={() => onDetail(event)}
          >
            Chi tiết
          </button>
          <ActionDropdown
            event={event}
            onChangeStatus={onChangeStatus}
            loading={changingId === event.id}
          />
        </div>
      </div>
    </div>
  );
}

// ── Trang chính ─────────────────────────────────────────────────────────────
const STATUSES = [
  { value: "",          label: "Tất cả trạng thái" },
  { value: "PUBLISHED", label: "Đã đăng"           },
  { value: "DRAFT",     label: "Nháp"               },
  { value: "CANCELLED", label: "Đã hủy"             },
  { value: "COMPLETED", label: "Hoàn thành"         },
];

export default function EventsPage({ api }) {
  const [events, setEvents]           = useState([]);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [loading, setLoading]         = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch]           = useState("");
  const [status, setStatus]           = useState("");
  const [refetch, setRefetch]         = useState(0);
  const [detail, setDetail]           = useState(null);
  const [changingId, setChangingId]   = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, size: 12 });
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    api.get(`/events/admin/all?${params}`).then((res) => {
      setEvents(res.result?.content ?? []);
      setTotalPages(res.result?.totalPages ?? 1);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, status, refetch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  // Gọi PATCH /events/{id}/status?status=... (endpoint mới chỉ đổi status)
  const handleChangeStatus = async (event, newStatus) => {
    const label = newStatus === "PUBLISHED" ? "duyệt" : "từ chối";
    if (!window.confirm(`Xác nhận ${label} sự kiện "${event.name}"?`)) return;

    setChangingId(event.id);
    await api.patch(`/events/${event.id}/status?status=${newStatus}`);
    setChangingId(null);
    setRefetch((n) => n + 1);
  };

  return (
    <>
      {detail && <EventDetailModal event={detail} onClose={() => setDetail(null)} />}

      <div className="card border-0 shadow-sm">
        {/* Toolbar */}
        <div className="card-header bg-white border-bottom">
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="d-flex gap-2 align-items-center">
              <span className="fw-semibold">▼ Lọc & sắp xếp</span>
              <select
                className="form-select form-select-sm"
                style={{ width: 170 }}
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <form className="d-flex gap-2" onSubmit={handleSearch}>
              <input
                className="form-control form-control-sm"
                style={{ width: 220 }}
                placeholder="Tìm kiếm sự kiện..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="btn btn-sm btn-primary">Tìm</button>
              {search && (
                <button type="button" className="btn btn-sm btn-outline-secondary"
                  onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}>
                  Xóa
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5 text-muted">Đang tải...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-5 text-muted">Không có sự kiện nào.</div>
          ) : (
            <div className="d-grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {events.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onDetail={setDetail}
                  onChangeStatus={handleChangeStatus}
                  changingId={changingId}
                />
              ))}
            </div>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  );
}