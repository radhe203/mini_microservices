import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";

function PostList() {
  const [posts, setPosts] = useState({});
  console.log(posts)

  async function getPost() {
    try {
      const res = await fetch("http://localhost:4002/posts");
      const data = await res.json();
      if (res.ok) {
        setPosts(data);
      } else {
        throw new Error("Failed to fetch Post");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const renderPosts = Object.values(posts).map((post) => (
    <PostCard tittle={post.tittle} key={post.id} postId={post.id} comments={post.comments} />
  ));

  useEffect(() => {
    getPost();
  }, []);
  return (
    <div>
      <h1 className=" text-blue-500 text-2xl font-semibold text-center p-3 border-b border-slate-500  sticky top-0 z-10 bg-white shadow-lg shadow-gray-300">
        Your all posts
      </h1>

      <div className=" flex flex-wrap gap-5 px-3 py-5">{renderPosts}</div>
    </div>
  );
}

export default PostList;
