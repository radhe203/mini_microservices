import { useEffect, useState } from "react";

function RenderComment({ comments }) {
  // async function getComment() {
  //   try {
  //       const res = await fetch(`http://localhost:4001/posts/${postId}/comment`);
  //       const data = await res.json();
  //       if (res.ok) {
  //         setComment(data);
  //       } else {
  //         throw new Error("Failed to fetch Post");
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  // }

  // useEffect(() => {
  //   getComment();
  // }, []);

  if (!comments) {
    return <></>;
  }
  return (
    <div className=" mt-4 flex flex-col gap-0">
      {comments.map((comment) => {
        let content = "Awaiting comment moderation";
        if (comment.status === "approved") {
          content = comment.content;
        } else if (comment.status === "rejected") {
          content = "This comment has been rejected";
        }

        return (
          <p className=" text-sm font-medium text-gray-500" key={comment.id}>
            {content}
          </p>
        );
      })}
    </div>
  );
}

export default RenderComment;
