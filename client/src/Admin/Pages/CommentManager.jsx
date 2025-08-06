import axios from "axios";
import { useEffect, useState } from "react";

export default function CommentManager() {
const apiUrl = import.meta.env.VITE_API_BASE_URL;


  const [comments, setComments] = useState([]);
  const [blogId, setBlogId] = useState(""); // for filtering by blog
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch comments for a specific blog
  const fetchComments = async () => {
    if (!blogId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/Comment/blog/${blogId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create comment
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!blogId || !newComment.trim()) return;

    try {
      await axios.post(`${apiUrl}/api/Comment/blog/${blogId}`, {
        content: newComment,
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  // Update comment
  const handleUpdate = async (id, content) => {
    const updatedContent = prompt("Edit comment:", content);
    if (updatedContent === null) return;

    try {
      await axios.put(`${apiUrl}/api/Comment/${id}`, { content: updatedContent });
      fetchComments();
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  // Delete comment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axios.delete(`${apiUrl}/api/Comment/${id}`);
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Comments</h2>

      {/* Blog ID input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Blog ID"
          value={blogId}
          onChange={(e) => setBlogId(e.target.value)}
          className="border p-2 flex-1"
        />
        <button
          onClick={fetchComments}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Load Comments
        </button>
      </div>

      {/* Create Comment Form */}
      {blogId && (
        <form onSubmit={handleCreate} className="flex gap-2 mb-6">
          <input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border p-2 flex-1"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Add
          </button>
        </form>
      )}

      {/* Comment List */}
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border">Content</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td colSpan="2" className="p-2 border text-center">
                  No comments found
                </td>
              </tr>
            ) : (
              comments.map((c) => (
                <tr key={c.id}>
                  <td className="p-2 border">{c.content}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => handleUpdate(c.id, c.content)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
