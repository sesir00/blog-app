import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ Add this line
import { Routes, Route } from "react-router-dom"; // ✅ import routing tools
import "./App.css";
import HeroPost from "./Components/HeroPost";
import FeaturedList from "./Components/FeaturedList";
import Headlines from "./Components/Headlines";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import About from "./pages/About"; // ✅ Add your route pages
import Contact from "./pages/Contact"; // ✅ Add your route pages

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:44388/api/Blog")
      .then((res) => setPosts(res.data.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-screen-xl mx-auto px-4 py-6 grid grid-cols-[2fr_1.5fr_1fr] gap-6">
              <div className="lg:col-span-2">
                <HeroPost post={posts[3]} />
              </div>              
              <FeaturedList posts={posts} />
            </div>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
