import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Edit, Trash2, MessageSquare } from "lucide-react"; // ✅ Icons

export default function BlogManager() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const pageSize = import.meta.env.VITE_PAGE_SIZE || 5;
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    totalPages: 1,
  });
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
    isPublished: false,
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchBlogs = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/Blog?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogs(res.data.data || []);
      setPagination({
        pageNumber: res.data.pageNumber,
        totalPages: res.data.totalPages,
      });
    } catch (err) {
      toast.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content)
      return toast.error("Please fill in all fields");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("image", form.image || "");
      formData.append("isPublished", form.isPublished);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = editingId
        ? await axios.put(`${apiUrl}/api/Blog/${editingId}`, formData, config)
        : await axios.post(`${apiUrl}/api/Blog`, formData, config);

      toast.success(response.data?.message || "Operation successful");
      setForm({ title: "", content: "", image: null, isPublished: false });
      setEditingId(null);
      fetchBlogs();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleViewComments = (blogId) => {
    navigate(`/admin/comments?blogId=${blogId}`, {
      state: { activeCommentView: true },
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const response = await axios.delete(`${apiUrl}/api/Blog/${id}`);
      toast.success(response.data?.message || "Deleted successfully");
      fetchBlogs();
    } catch {
      toast.error("Error deleting blog");
    }
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      content: blog.content,
      image: blog.image,
      isPublished: blog.isPublished,
    });
    setEditingId(blog.id);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Blogs</h2>
      {/* Blog Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      >
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <div className="flex flex-col gap-4">
          <label className="w-fit">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              className="inline-block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>
          <label className="inline-flex items-center w-fit">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) =>
                setForm({ ...form, isPublished: e.target.checked })
              }
              className="mr-2"
            />
            Published
          </label>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Create"}
          </button>
        </div>
      </form>
      {/* Table */}
      {loading ? (
        <p>Loading blogs...</p>
      ) : (
        <table className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 border-b dark:border-gray-700">Image</th>
              <th className="p-3 border-b dark:border-gray-700">Title</th>
              <th className="p-3 border-b dark:border-gray-700">Status</th>
              <th className="p-3 border-b dark:border-gray-700 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-3 border-b dark:border-gray-700">
                  {blog.imageUrl ? (
                    <img
                      src={`${apiUrl}${blog.imageUrl}`}
                      alt="Blog"
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-500 text-center">No image</span>
                  )}
                </td>
                <td className="p-3 border-b dark:border-gray-700 text-center">
                  {blog.title}
                </td>
                <td className="p-3 border-b dark:border-gray-700 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      blog.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3 border-b dark:border-gray-700 text-center space-x-2">
                  {/* View Comments */}
                  <button
                    onClick={() => handleViewComments(blog.id)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full"
                    title="View Comments"
                  >
                    <MessageSquare size={16} className="text-blue-700" />
                  </button>
                  <button
                    onClick={() => handleEdit(blog)}
                    className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-full"
                  >
                    <Edit size={16} className="text-yellow-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-full"
                  >
                    <Trash2 size={16} className="text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={pagination.pageNumber <= 1}
          onClick={() => fetchBlogs(pagination.pageNumber - 1)}
          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {pagination.pageNumber} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.pageNumber >= pagination.totalPages}
          onClick={() => fetchBlogs(pagination.pageNumber + 1)}
          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000} // ⏱️ 5 seconds
        hideProgressBar={false} // ⛔ false = show progress bar
        newestOnTop={false}
        closeOnClick // 🖱️ closes toast on click
        rtl={false} // 🌍 right-to-left support
        pauseOnFocusLoss // ⏸ pauses when tab loses focus
        draggable // 🖱️ allows drag to dismiss
        pauseOnHover // ⏸ pause timer on hover
        theme="light" // 🎨 "light" | "dark" | "colored"
      />{" "}
    </div>
  );
}
