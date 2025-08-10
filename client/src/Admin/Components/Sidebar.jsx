import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Blogs", path: "/admin/blogs" },
    { name: "Users", path: "/admin/users" },
    { name: "Comments", path: "/admin/comments" },
  ];
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 fixed">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`block p-2 rounded mb-2 hover:bg-gray-700 ${
            location.pathname === item.path ? "bg-gray-800" : ""
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
