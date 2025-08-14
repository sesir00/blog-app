import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2, ArrowLeft, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CommentManager() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [searchParams] = useSearchParams();
  const blogId = searchParams.get("blogId");

  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchComments = async () => {
    if (!blogId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/Comment/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      toast.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${apiUrl}/api/Comment/blog/${blogId}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments();
      toast.success("Comment added successfully!");
    } catch (err) {
      console.error("Error creating comment:", err);
      toast.error("Failed to add comment");
    }
  };

  const handleEditClick = (comment) => {
    setEditId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (id) => {
    if (!editContent.trim()) return;
    try {
      await axios.put(
        `${apiUrl}/api/Comment/${id}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setEditContent("");
      fetchComments();
      toast.success("Comment updated successfully!");
    } catch (err) {
      console.error("Error updating comment:", err);
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`${apiUrl}/api/Comment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
      toast.success("Comment deleted successfully!");
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/blogs")}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-2xl font-bold">Manage Comments</h2>
        </div>
        <span className="text-gray-400 text-sm">
          Blog ID: <code>{blogId}</code>
        </span>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border border-gray-700 bg-gray-800 text-white p-2 flex-1 rounded"
        />
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      <div className="overflow-x-auto border border-gray-700 rounded-lg">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="p-3 border-b border-gray-700 w-2/3">Content</th>
              <th className="p-3 border-b border-gray-700 text-center w-1/6">Author</th>
              <th className="p-3 border-b border-gray-700 text-center w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-400">
                  Loading comments...
                </td>
              </tr>
            ) : comments.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-400">
                  No comments found
                </td>
              </tr>
            ) : (
              comments.map((c) => (
                <tr key={c.id} className="hover:bg-gray-800 transition-colors duration-150">
                  <td className="p-3 border-b border-gray-700 break-words whitespace-normal">
                    {editId === c.id ? (
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="border border-gray-600 bg-gray-700 text-white p-2 w-full rounded"
                      />
                    ) : (
                      c.content
                    )}
                  </td>
                  <td className="p-3 border-b border-gray-700 text-center">
                    {c.userName || "Unknown"}
                  </td>
                  <td className="p-3 border-b border-gray-700 text-center space-x-2">
                    {editId === c.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(c.id)}
                          className="p-2 bg-green-100 hover:bg-green-200 rounded-full"
                        >
                          <Edit size={16} className="text-green-700" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded-full"
                        >
                          <X size={16} className="text-red-700" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(c)}
                          className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-full"
                        >
                          <Edit size={16} className="text-yellow-700" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded-full"
                        >
                          <Trash2 size={16} className="text-red-700" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
