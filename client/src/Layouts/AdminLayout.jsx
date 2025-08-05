import { Outlet } from "react-router-dom";
import AdminSidebar from "../Components/AdminSidebar"; // optional
import AdminNavbar from "../Components/AdminNavbar";   // optional

const AdminLayout = () => (
  <div className="admin-layout">
    <AdminNavbar />
    <div className="admin-content">
      <AdminSidebar />
      <main>
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;
