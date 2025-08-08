import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/Blog/${id}`, {
        //  withCredentials: true
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send the token here
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
  }, [id, apiUrl]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} - Your Blog Name`;
    }
  }, [post]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!post) return <div className="text-center p-8">Post not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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

            {/* View More Posts Button at Bottom */}
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
      </div>
    </div>
  );
};

export default PostDetail;