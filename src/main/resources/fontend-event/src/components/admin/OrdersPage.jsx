import { useState, useEffect } from "react";
import { StatusBadge, Pagination, VND } from "../../utils/helpers";

export default function OrdersPage({ api }) {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/orders?page=${page}&size=10`).then((res) => {
      setOrders(res.result?.content ?? []);
      setTotalPages(res.result?.totalPages ?? 1);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white fw-semibold border-bottom">🧾 Lịch sử Đơn hàng// Cái này nháp thôi</div>

      {loading ? (
        <div className="text-center py-4 text-muted">Đang tải...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Mã đơn</th><th>Tổng tiền</th><th>Phương thức</th>
                <th>TT thanh toán</th><th>TT đơn hàng</th><th>Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="fw-semibold text-primary">ORD-{o.id}</td>
                  <td>{VND(o.totalAmount)}</td>
                  <td>{o.paymentMethod}</td>
                  <td><StatusBadge status={o.paymentStatus} /></td>
                  <td><StatusBadge status={o.orderStatus} /></td>
                  <td>{o.orderDate?.slice(0, 10) ?? "—"}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="text-center py-3 text-muted">Không có đơn hàng.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}