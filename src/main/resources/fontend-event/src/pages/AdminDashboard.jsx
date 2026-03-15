import { useState } from "react";
import { useApi } from "../hooks/useApi";
import Sidebar, { MENU } from "../components/admin/Sidebar";
import DashboardPage  from "../components/admin/DashboardPage";
import EventsPage     from "../components/admin/EventsPage";
import UsersPage      from "../components/admin/UsersPage";
import CategoriesPage from "../components/admin/CategoriesPage";
import OrdersPage     from "../components/admin/OrdersPage";

export default function AdminDashboard() {
  const api = useApi();
  const [active, setActive] = useState("dashboard");

  const PAGE = {
    dashboard:  <DashboardPage  api={api} />,
    events:     <EventsPage     api={api} />,
    users:      <UsersPage      api={api} />,
    categories: <CategoriesPage api={api} />,
    orders:     <OrdersPage     api={api} />,
  };

  const activeMenu = MENU.find((m) => m.key === active);

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Sidebar active={active} onSelect={setActive} />

      <div className="flex-grow-1 p-4" style={{ overflow: "auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold">
            {activeMenu?.icon} {activeMenu?.label}
          </h5>
          <span className="badge bg-danger px-3 py-2">ADMIN</span>
        </div>

        {PAGE[active] ?? <p className="text-muted">Đang phát triển...</p>}
      </div>
    </div>
  );
}