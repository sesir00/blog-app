import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MessageSquare,
  User,
  Calendar,
  Send,
  LogIn,
  UserPlus,
  Loader2,
  AlertTriangle,
  SearchX,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("token");

  // Fetch post details
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/Blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPost(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load post");
        setLoading(false);
        console.error(err);
      });
  }, [id, apiUrl, token]);

  // Fetch comments
  const fetchComments = async () => {
    if (!id) return;

    setCommentsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/comment/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      // Don't show error for comments, just log it
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (post) {
      document.title = `${post.title} - Your Blog Name`;
      fetchComments();
    }
  }, [post]);

  // Submit new comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await axios.post(
        `${apiUrl}/api/Comment/blog/${id}`,
        {
          content: newComment.trim(),
          // blogId: parseInt(id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Comment added successfully!");
      setNewComment("");
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error("Failed to submit comment:", err);
      toast.error("Failed to submit comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

const formatDate = (dateInput) => {
  if (!dateInput) return "";

  // Convert backend string to ISO format: " " → "T" and remove extra fractional seconds if needed
  let isoString = dateInput.replace(" ", "T").split(".")[0] + "Z"; // Treat as UTC

  const date = new Date(isoString);

  if (isNaN(date)) return dateInput; // fallback

  return new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // user's local time
  }).format(date);
};



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-600">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-lg font-medium">Loading post...</p>
        <p className="text-sm text-gray-500">Please wait a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertTriangle size={40} className="mb-4" />
        <p className="text-lg font-semibold">Something went wrong</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-600">
        <SearchX size={40} className="mb-4 text-gray-400" />
        <p className="text-lg font-medium">Post not found</p>
        <p className="text-sm text-gray-500">
          It might have been removed or doesn’t exist
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Post Image */}
          {post.imageUrl && (
            <div className="w-full overflow-hidden">
              <img
                src={`${apiUrl}${post.imageUrl}`}
                alt={post.title}
                className="w-full h-auto max-h-[600px] object-cover transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="p-6 sm:p-8 lg:p-12">
            {/* Post Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              {post.title}
            </h1>

            {/* Publication Date */}
            <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {post.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Published on{" "}
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-lg sm:prose-xl max-w-none text-gray-800">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-10 lg:col-start-2">
                  {post.content.split("\n").map(
                    (paragraph, index) =>
                      paragraph.trim() && (
                        <p key={index} className="mb-6 leading-relaxed text-lg">
                          {paragraph}
                        </p>
                      )
                  )}
                </div>
              </div>
            </div>

            {/* Tags or Categories (if you have them) */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Sports
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  News
                </span>
              </div>
            </div>

            {/* View More Posts Button */}
            <div className="mt-12 text-center">
              <button
                onClick={() => navigate("/")}
                className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 shadow-md"
              >
                View More Posts
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Comments Header */}
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-gray-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">
                Comments ({comments.length})
              </h2>
            </div>

            {/* Add Comment Form */}
            {token && (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="flex flex-col gap-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    disabled={submittingComment}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={16} />
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {commentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare
                    className="mx-auto text-gray-400 mb-4"
                    size={48}
                  />
                  <p className="text-gray-600 text-lg">No comments yet</p>
                  <p className="text-gray-500">
                    Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    {/* Comment Header */}
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="text-blue-600" size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-gray-900">
                            {comment.userName || "Anonymous"}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar size={14} />
                            <span>{formatDate(comment.createdAt)}</span>
                          </div>
                        </div>
                        {/* Comment Content */}
                        <div className="text-gray-800 leading-relaxed">
                          {comment.content.split("\n").map((line, index) => (
                            <p key={index} className="mb-2 last:mb-0">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Login prompt for non-authenticated users */}
            {!token && (
              <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="flex flex-col items-center">
                  {/* Big Icon */}
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 dark:from-blue-500 dark:to-purple-600 p-3 rounded-full shadow mb-4">
                    <LogIn className="text-white" size={28} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Join the Conversation
                  </h3>

                  {/* Subtext */}
                  <p className="text-gray-600 dark:text-gray-300 mb-5 max-w-sm">
                    Sign in to leave a comment and share your thoughts with our
                    community.
                  </p>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus size={18} />
                    Sign In to Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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
};

export default PostDetail;
