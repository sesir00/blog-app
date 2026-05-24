import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../Services/AuthService";
import { UserCircle, Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role == "admin";

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-black tracking-wide">
          <img src="/logo.png" alt="Ballerstalk Logo" className="h-10 w-18" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-black">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-black">Contact</Link>

          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin" className="text-gray-700 hover:text-black font-medium">
                  Dashboard
                </Link>
              ) : (
                <Link to="#" className="flex items-center space-x-2 text-gray-800 hover:text-black font-medium">
                  <UserCircle className="h-5 w-5" />
                  <span>{user.username}</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-black font-medium">Login</Link>
              <Link
                to="/register"
                className="ml-2 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 font-medium text-sm tracking-wide shadow-sm hover:shadow-md transition-all duration-200"
              >
                Get Started →
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 hover:text-black"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md px-4 pb-4">
          <nav className="flex flex-col space-y-3 pt-3">
            <Link to="/" onClick={closeMenu} className="text-gray-700 hover:text-black py-1">Home</Link>
            <Link to="/about" onClick={closeMenu} className="text-gray-700 hover:text-black py-1">About</Link>
            <Link to="/contact" onClick={closeMenu} className="text-gray-700 hover:text-black py-1">Contact</Link>

            {user ? (
              <>
                {isAdmin ? (
                  <Link to="/admin" onClick={closeMenu} className="text-gray-700 hover:text-black font-medium py-1">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="#" onClick={closeMenu} className="flex items-center space-x-2 text-gray-800 font-medium py-1">
                    <UserCircle className="h-5 w-5" />
                    <span>{user.username}</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="text-gray-700 hover:text-black font-medium py-1">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 font-medium text-sm tracking-wide text-center shadow-sm transition-all duration-200"
                >
                  Get Started →
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;