import React, { useState } from "react";

function CreateComment({ postId }) {
  const [comment, setComment] = useState("");

  async function commentHandel(e) {
    e.preventDefault();

    if (comment == "") {
      return;
    }

    try {
      const res = await fetch(`http://posts.com/comments/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ content: comment }),
      });

      if (res.ok) {
        setComment("");
      } else {
        throw new Error("Failed to create comment");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form
      className=" flex flex-col text-center gap-2 absolute bottom-4  right-4  left-4"
      onSubmit={commentHandel}
    >
      <input
        type="text"
        className="  py-1 border-b-2 border-slate-300 outline-none text-blue-500 w-full rounded-sm"
        onChange={(e) => {
          setComment(e.target.value);
        }}
        value={comment}
        required
        placeholder="Write a comment"
      />
      <button
        type="submit"
        className="px-3 py-1 rounded-md font-semibold border-2 border-slate-600 transition-all duration-300 hover:bg-slate-600 hover:text-white"
      >
        Submit
      </button>
    </form>
  );
}

export default CreateComment;
