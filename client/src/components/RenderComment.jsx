
function RenderComment({ comments }) {
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
