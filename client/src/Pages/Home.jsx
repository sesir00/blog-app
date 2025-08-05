import { useEffect, useState } from "react";
import axios from "axios";
import Postlist from "../Components/PostList";
import Pagination from "../Components/Pagination";
import FeaturedList from "../Components/FeaturedList";

export default function Home() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 5; // you can change this

  const fetchPosts = (pageNumber) => {
    axios
      .get(`${apiUrl}/api/Blog?pageNumber=${pageNumber}&pageSize=${pageSize}`, 
      {
        withCredentials: true,
      })
      .then((res) => {
        setPosts(res.data.data);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 grid grid-cols-[2fr_1.5fr_1fr] gap-6">
      <div className="lg:col-span-2">
        <Postlist posts={posts} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>
      <FeaturedList posts={posts} />
    </div>
  );
}
