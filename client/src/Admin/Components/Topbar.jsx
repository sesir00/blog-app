// import { useTheme } from "../../Context/ThemeContext";
import { logoutUser } from "../../Services/AuthService";
import { Link, useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };
  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 shadow">
      <Link to="/" className="text-2xl font-bold text-white tracking-wide">
          <img src="/logo-white.png" alt="Ballerstalk Logo" className="h-10 w-auto" />
        </Link>
      <button
        onClick={handleLogout}
        className="ml-auto mr-1 bg-red-500 px-3 py-1 rounded text-white"
      >
        Logout
      </button>
    </div>
  );
}
