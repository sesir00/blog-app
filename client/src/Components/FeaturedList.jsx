export default function FeaturedList({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="flex gap-4">
          {post.imageUrl ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`}
              alt={post.title}
              className="w-24 h-24 object-cover rounded"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded flex items-center justify-center text-sm text-gray-500">No image</div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-md">{post.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{post.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
