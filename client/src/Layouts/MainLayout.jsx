// src/Layouts/MainLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const MainLayout = () => {
  const location = useLocation();
  const authRoutes = ['/login', '/register'];
  const shouldHideNavAndFooter = authRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavAndFooter && <Navbar />}
      <Outlet />
      {!shouldHideNavAndFooter && <Footer />}
    </>
  );
};

export default MainLayout;
