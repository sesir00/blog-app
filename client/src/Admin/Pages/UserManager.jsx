import { useEffect, useState } from "react";
import axios from "axios";

export default function UserManager() {
const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // default role
  });
  const [loading, setLoading] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/User?pageNumber=1&pageSize=5`); 
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/Auth/register`, {
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.password,
        role: form.role,
      });
      setForm({ username: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${apiUrl}/api/Auth/users/${id}`); 
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>

      {/* Create User Form */}
      <form onSubmit={handleCreate} className="space-y-2 mb-6">
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
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Create User
        </button>
      </form>

      {/* User List Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border">{u.username}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.role}</td>
                <td className="p-2 border">
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
    </div>
  );
}
