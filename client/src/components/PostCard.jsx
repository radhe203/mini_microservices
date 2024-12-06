import React, { useState } from "react";
import RenderComment from "./RenderComment";
import CreateComment from "./CreateComment";

function PostCard({tittle,comments,postId}) {
  
  return (
    <div className=" w-[250px] h-[300px] border border-slate-800 rounded-md p-4 relative">
      <h2 className=" font-semibold italic">{tittle}</h2>

      <RenderComment comments={comments}/>

      <CreateComment postId={postId}/>

     
    </div>
  );
}

export default PostCard;
