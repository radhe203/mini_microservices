import express from "express";
import { randomBytes } from "crypto";
import cors from "cors";
import call from "./call.js";
const app = express();
app.use(cors());
app.use(express.json());

const commentsByPostId = {};

app.get("/comments/posts/:id/comment", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/comments/posts/:id/comment", async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  const commentId = randomBytes(4).toString("hex");

  const comments = commentsByPostId[postId] || [];

  comments.push({
    id: commentId,
    content,
    status: "pending",
  });

  commentsByPostId[postId] = comments;

  try {
    const eventResponse = await call(
      "http://event-bus-srv:4005/event-bus/events",
      "POST",
      {},
      {
        type: "CommentCreated",
        data: {
          id: commentId,
          content,
          postId,
          status: "pending",
        },
      }
    );
    console.log("Event Response:", eventResponse);

    res.status(201).send(comments);
  } catch (error) {
    console.error("Error dispatching event:", error.message);
    res.status(500).send({ error: "Failed to create post" });
  }
});

app.post("/comments/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("Recived Event",type);
  if (type === "CommentModerated") {
    const { id, status, postId, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => comment.id === id);

    comment.status = status;

    try {
      await call(
        "http://event-bus-srv:4005/event-bus/events",
        "POST",
        {},
        {
          type: "CommentUpdated",
          data: {
            id,
            content,
            postId,
            status,
          },
        }
      );

      res.sendStatus(200);
    } catch (error) {
      console.error("Error dispatching event:", error.message);
      res.status(500).send({ error: "Failed to send event" });
    }
  } else {
    res.sendStatus(200);
  }
});

app.listen(4001, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 4001 !!");
  }
});
