import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator";

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
    // confirmPassword: "",
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

    if (
      !form.username ||
      !form.email ||
      (!editingId && !form.password)
      // !form.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    // Email validation
    if (!validator.isEmail(form.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!editingId && form.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    // Confirm password check (only for new user or if password is changed)
    // if (!editingId && form.password !== form.confirmPassword) {
    //   toast.error("Passwords do not match");
    //   return;
    // }

    try {
      const roleValue = form.role === "admin" ? 0 : 1;
      let response;
      if (editingId) {
        // Update user
        response = await axios.put(
          `${apiUrl}/api/User/${editingId}`,
          {
            username: form.username,
            email: form.email,
            password: form.password || undefined,
            // confirmPassword: form.password || undefined,
            role: roleValue,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create user
        response = await axios.post(
          `${apiUrl}/api/User`,
          {
            username: form.username,
            email: form.email,
            password: form.password,
            // confirmPassword: form.password,
            role: roleValue,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // ✅ Use backend message for toast
      toast.success(response.data?.message || "Operation successful");

      setForm({ username: "", email: "", password: "", role: "" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    let response;
    try {
      response = await axios.delete(`${apiUrl}/api/User/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      toast.success(response.data?.message || "Deleted successfully");

    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    console.log("✏️ Editing user:", user); // ✅ Debug incoming edit data

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
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      {/* Create/Edit User Form */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder={
            editingId ? "Leave blank to keep current password" : "Password"
          }
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 w-full"
          required={!editingId}
        />
        {/* <input
          type="password"
          placeholder={
            editingId
              ? "Leave blank to keep current password"
              : "Confirm Password"
          }
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          className="border p-2 w-full"
          required={!editingId}
        /> */}

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 w-full bg-gray-800 text-white"
          required
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update User" : "Create User"}
        </button>
      </form>
      {/* User Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="mt-12 w-full border text-center">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border text-center">Username</th>
              <th className="p-2 border text-center">Email</th>
              <th className="p-2 border text-center">Role</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border ">{u.username}</td>
                <td className="p-2 border ">{u.email}</td>
                <td className="p-2 border ">{u.role}</td>
                <td className="p-2 border  flex justify-center gap-2">
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleEdit(u)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          disabled={pagination.pageNumber <= 1}
          onClick={() => fetchUsers(pagination.pageNumber - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {pagination.pageNumber} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.pageNumber >= pagination.totalPages}
          onClick={() => fetchUsers(pagination.pageNumber + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
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
