import Sidebar from "../Admin/Components/Sidebar";
import Topbar from "../Admin/Components/Topbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
