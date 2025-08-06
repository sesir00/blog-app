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

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/Blog/${id}`, 
      {
         withCredentials: true 
      })
      .then((res) => {
        setPost(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load post");
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
    <div className="max-w-screen-md mx-auto px-4 py-10">
      {/* View More Posts Button at the Top */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 shadow-md"
        >
          View More Posts
        </button>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="overflow-hidden rounded shadow-lg mb-6">
          <img
            src={`${apiUrl}${post.imageUrl}`}
            alt={post.title}
            className="w-full h-auto transform transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      {/* Post Title */}
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>

      {/* Publication Date */}
      <p className="text-sm text-gray-600 mb-8 border-b border-gray-200 pb-4">
        Published on{" "}
        {new Date(post.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* Post Content */}
      <div className="prose prose-lg max-w-none text-gray-800">
        {post.content.split("\n").map(
          (paragraph, index) =>
            paragraph.trim() && (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            )
        )}
      </div>
    </div>
  );
};

export default PostDetail;
