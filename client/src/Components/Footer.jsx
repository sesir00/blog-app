// src/Components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-10 border-t">
      <div className="container mx-auto p-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Blogify — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
