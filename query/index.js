import express, { json } from "express";
import cors from "cors";
import call from "./call.js";

const app = express();
app.use(cors());
app.use(express.json());

const posts = {};

function HandelEvent(type, data) {
  if (type === "PostCreated") {
    const { id, tittle } = data;
    posts[id] = {
      id,
      tittle,
      comments: [],
    };
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];

    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
}

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  HandelEvent(type, data);

  res.send({});
});

app.listen(4002, async (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 4002 !!");

    let events = []
    try {
      const res = await call("http://localhost:4005/events");
      events = await JSON.parse(res["response"])
    } catch (error) {
      console.error("Error fetching events:", error.message);
    }

    for (const element of events) {
      HandelEvent(element.type, element.data);
    }
  }
});
