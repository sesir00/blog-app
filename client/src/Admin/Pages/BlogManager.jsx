import { useEffect, useState } from "react";
import axios from "axios"; // ✅ Direct Axios import

export default function BlogManager() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", isPublished: false });
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/Blog`);
      setBlogs(res.data.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/Blog`, form);
      fetchBlogs();
      setForm({ title: "", content: "", isPublished: false });
    } catch (err) {
      console.error("Error creating blog:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/Blog/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Blogs</h2>

      <form onSubmit={handleCreate} className="space-y-2 mb-6">
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          className="border p-2 w-full"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={e => setForm({ ...form, isPublished: e.target.checked })}
          />
          <span className="ml-2">Published</span>
        </label>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!form.title || !form.content}
        >
          Create
        </button>
      </form>

      {loading ? (
        <p>Loading blogs...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog.id}>
                <td className="p-2 border">{blog.title}</td>
                <td className="p-2 border">{blog.isPublished ? "Published" : "Draft"}</td>
                <td className="p-2 border">
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}