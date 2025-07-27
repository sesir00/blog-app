const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function HeroPost({ post }) {
  if (!post) return null;
 const fullImagePath = `${apiUrl}${post.imageUrl}`;
  console.log("Full image URL:", fullImagePath);
  return (
    <div>
      {post.imageUrl
        ? <img src={`${apiUrl}${post.imageUrl}`} alt={post.title} className="w-full h-auto rounded" />
        : <div className="w-full h-64 bg-gray-200 flex items-center justify-center">No image</div>
      }
      <h2 className="text-2xl font-serif mt-2">{post.title}</h2>
          <p className="text-gray-700">{post.content?.slice(0, 200)}...</p>
    </div>
  );
}
