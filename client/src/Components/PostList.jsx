import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";

const PostList = ({ posts, loading, error }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Post Details:", posts);
    posts?.forEach((post) => {
      console.log("Full image path:", `${apiUrl}/${post.imageUrl}`);
    });
  }, [posts, apiUrl]); // Only logs when posts or apiUrl changes

  // Handle loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-600">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-lg font-medium">Loading posts...</p>
        <p className="text-sm text-gray-500">Please wait a moment</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle size={40} className="mb-4" />
        <p className="text-lg font-semibold">Something went wrong</p>
        <p className="text-sm text-gray-500 mb-4">
          {typeof error === "string"
            ? error
            : "Unable to load posts. Please try again later."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 text-gray-600 rounded-lg shadow-inner border border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold">No Posts Available</h3>
        <p className="text-sm text-gray-500 mt-1">
          Check back later for fresh content.
        </p>
      </div>
    );
  }
  const handleClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="flex flex-col gap-10 mr-5">
      {" "}
      {/* Vertical feed, spaced between */}
      {posts.map((post) => {
        const fullImagePath = `${apiUrl}${post.imageUrl}`;
        // console.log("Full image path:", fullImagePath);
        return (
          <div
            key={post.id}
            onClick={() => handleClick(post.id)}
            className="cursor-pointer"
          >
            {post.imageUrl ? (
              <img
                src={fullImagePath}
                alt={post.title}
                className="w-full max-h-[500px] object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                No image
              </div>
            )}
            <h2 className="text-2xl font-semibold mt-3">
              {post.title.length > 100
                ? `${post.title.slice(0, 100)}...`
                : post.title}
            </h2>
            <p className="text-gray-700 mt-1">
              {post.content?.slice(0, 200)}...
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
