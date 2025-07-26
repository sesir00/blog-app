import React, { useState, useEffect } from 'react';
import axios from 'axios';  // ✅ Add this line
import './App.css';
import HeroPost from './Components/HeroPost';
import FeaturedList from './Components/FeaturedList';
import Headlines from './Components/Headlines';


function App() {
 const [posts, setPosts] = useState([]);

useEffect(() => {
  axios.get('https://localhost:44388/api/Blog')
    .then(res => setPosts(res.data.data))
    .catch(console.error);
}, []);


  return (
    <>
      <div className="container mx-auto p-4 grid grid-cols-[2fr_1.5fr_1fr] gap-6">
    <HeroPost post={posts[0]} />
    <FeaturedList posts={posts} />
    <Headlines posts={posts} />
  </div>
    </>
  )
}

export default App
