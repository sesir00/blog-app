import { Route, Routes } from "react-router-dom";
import "./App.css";

import MainLayout from "./Layouts/MainLayout";
import AdminLayout from "./Layouts/AdminLayout";

import Analytics from "./Admin/Pages/Analytics";
import BlogManager from "./Admin/Pages/BlogManager";
import UserManager from "./Admin/Pages/UserManager";
import CommentManager from "./Admin/Pages/CommentManager";

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
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <AdminLayout>
              <BlogManager />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <UserManager />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/comments"
          element={
            <AdminLayout>
              <CommentManager />
            </AdminLayout>
          }
        />

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
