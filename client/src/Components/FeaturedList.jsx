function PostCard({ post }) {
  return (
    <div className="flex gap-4 mb-4">
      <img src={post.imageUrl} className="w-24 h-24 object-cover rounded" />
      <div>
        <h3 className="font-serif text-lg">{post.title}</h3>
        <p className="text-sm text-gray-600">{post.summary}</p>
      </div>
    </div>
  );
}

export default function FeaturedList({ posts }) {
  return (
    <div>
      {posts?.slice(1, 5).map(p => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
