import { useEffect, useState } from "react";
import axios from "axios";
import Postlist from "../Components/PostList";
import Pagination from "../Components/Pagination";
import FeaturedList from "../Components/FeaturedList";

export default function Home() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const pageSize = import.meta.env.VITE_PAGE_SIZE || 5; // you can change this

  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async (pageNumber) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${apiUrl}/api/Blog?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        { withCredentials: true }
      );

      setPosts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError("Failed to load posts. Please try again later.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedPosts = async () => {
    // Fetch the top/featured posts (always from page 1, limited number)
    try {
      const res = await axios.get(
        `${apiUrl}/api/Blog?pageNumber=1&pageSize=5`,
        { withCredentials: true }
      );
      setFeaturedPosts(res.data.data);
    } catch (err) {
      console.error("Error fetching featured posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    // Fetch featured posts only once when component mounts
    fetchFeaturedPosts();
    //console.log("Feature Posts", featuredPosts.posts);
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 grid grid-cols-[2fr_1.5fr_1fr] gap-6">
      <div className="lg:col-span-2">
        <Postlist 
          posts={posts}
          loading={loading}
          error={error}
        />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>
      <FeaturedList posts={featuredPosts} />
    </div>
  );
}
