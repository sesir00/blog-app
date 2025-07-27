import { Link } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_BASE_URL;


export default function PostCard({ post }) {
  return (
    <Link to={`/post/${post.id}`}>
      <div className="flex space-x-4 border-b py-3 hover:bg-gray-50">
        <img src={`${apiUrl}${post.imageUrl}`} className="w-20 h-20 object-cover rounded" />
        <div>
          <h4 className="font-semibold">{post.title}</h4>
          <p className="text-sm text-gray-600">{post.author} · {new Date(post.datePublished).toDateString()}</p>
        </div>
      </div>
    </Link>
  );
}
