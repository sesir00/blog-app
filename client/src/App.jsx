import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer";
import MainLayout from "./Layouts/MainLayout";

import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import PostDetail from "./Pages/PostDetail";
import Register from "./Pages/Register";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Route>

        {/* Auth pages without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
