import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react'

const PostList = ({ posts }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
  console.log("Post Details:", posts);
  posts.forEach(post => {
    console.log("Full image path:", `${apiUrl}/${post.imageUrl}`);
  });
}, [posts, apiUrl]); // Only logs when posts or apiUrl changes

  if (!posts || posts.length === 0) return <div>No posts available</div>;

  const handleClick = (id) => {
    navigate(`/post/${id}`);
  };
 
  return (
    <div className="flex flex-col gap-10 mr-5"> {/* Vertical feed, spaced between */}
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
            <h2 className="text-2xl font-semibold mt-3">{post.title}</h2>
            <p className="text-gray-700 mt-1">{post.content?.slice(0, 200)}...</p>
          </div>
        );
      })}
    </div>
  );
}

export default PostList

