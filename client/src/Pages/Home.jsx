import { useEffect, useState } from 'react';
import axios from 'axios';
import HeroPost from '../Components/HeroPost';
import PostCard from '../Components/PostCard';
import Pagination from '../Components/Pagination';
import FeaturedList from "../Components/FeaturedList";


export default function Home() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/Blog`)
      .then((res) => {
        setPosts(res.data.data);
        setTotal(res.data.totalPages);
      })
      .catch(console.error);
  }, [page]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 grid grid-cols-[2fr_1.5fr_1fr] gap-6">
      <div className="lg:col-span-2">
        <HeroPost post={posts} />
        <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />
      </div>
      <FeaturedList posts={posts} />
    </div>
  );
}
