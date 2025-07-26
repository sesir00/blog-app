export default function HeroPost({ post }) {
  if (!post) return null;
  return (
    <div>
      <img src={post.imageUrl} alt={post.title} className="w-full h-auto rounded" />
      <h2 className="text-2xl font-serif mt-2">{post.title}</h2>
      <p className="mt-1 text-gray-700">{post.summary}</p>
    </div>
  );
}
