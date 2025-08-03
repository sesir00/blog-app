// src/Components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-black tracking-wide">
          Blogify
        </Link>
        <nav className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-black">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-black">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-black">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
