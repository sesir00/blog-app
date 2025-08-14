import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator";
import { Edit, Trash2 } from "lucide-react"; // ✅ Icons

export default function UserManager() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const pageSize = import.meta.env.VITE_PAGE_SIZE || 5;
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    totalPages: 1,
  });
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch users
  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/User?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data.data || []);
      setPagination({
        pageNumber: res.data.pageNumber,
        totalPages: res.data.totalPages,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || (!editingId && !form.password)) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!validator.isEmail(form.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!editingId && form.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const roleValue = form.role === "admin" ? 0 : 1;
      let response;

      if (editingId) {
        response = await axios.put(
          `${apiUrl}/api/User/${editingId}`,
          {
            username: form.username,
            email: form.email,
            password: form.password || undefined,
            role: roleValue,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          `${apiUrl}/api/User`,
          {
            username: form.username,
            email: form.email,
            password: form.password,
            role: roleValue,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success(response.data?.message || "Operation successful");
      setForm({ username: "", email: "", password: "", role: "" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      toast.error(err, "Something went wrong");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await axios.delete(`${apiUrl}/api/User/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      toast.success(response.data?.message || "Deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err, "Something went wrong");
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditingId(user.id);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        👤 Manage Users
      </h2>
      {/* Create/Edit User Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border border-gray-300 dark:border-gray-700 p-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-gray-300 dark:border-gray-700 p-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder={
            editingId ? "Leave blank to keep current password" : "Password"
          }
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border border-gray-300 dark:border-gray-700 p-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          required={!editingId}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border border-gray-300 dark:border-gray-700 p-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          required
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition">
            {editingId ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
      {/* User Table */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-300">Loading users...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-3 border-b dark:border-gray-700">Username</th>
                <th className="p-3 border-b dark:border-gray-700">Email</th>
                <th className="p-3 border-b dark:border-gray-700">Role</th>
                <th className="p-3 border-b dark:border-gray-700 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-3 border-b dark:border-gray-700">
                    {u.username}
                  </td>
                  <td className="p-3 border-b dark:border-gray-700">
                    {u.email}
                  </td>
                  <td className="p-3 border-b dark:border-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role.toLowerCase() === "admin"
                          ? "bg-red-100 text-red-700 border border-red-300"
                          : "bg-blue-100 text-blue-700 border border-blue-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 border-b dark:border-gray-700 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(u)}
                      className="inline-flex items-center justify-center p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full transition"
                      title="Edit User"
                    >
                      <Edit size={16} className="text-yellow-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="inline-flex items-center justify-center p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition"
                      title="Delete User"
                    >
                      <Trash2 size={16} className="text-red-700" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-gray-500 dark:text-gray-300"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={pagination.pageNumber <= 1}
          onClick={() => fetchUsers(pagination.pageNumber - 1)}
          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {pagination.pageNumber} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.pageNumber >= pagination.totalPages}
          onClick={() => fetchUsers(pagination.pageNumber + 1)}
          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded disabled:opacity-50"
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
