import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../Services/AuthService";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-black tracking-wide">
          <img src="/logo.png" alt="Ballerstalk Logo" className="h-10 w-auto" />
        </Link>
        <nav className="space-x-6 flex items-center">
          <Link to="/" className="text-gray-700 hover:text-black">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-black">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-black">
            Contact
          </Link>

          {user ? (
            <>
              <span className="text-gray-800 font-medium">
                Hi, {user.username}
              </span>
              <button
                onClick={handleLogout}
className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-black-600 hover:text-blue font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
