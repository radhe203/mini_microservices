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

app.get("/query/posts", (req, res) => {
  res.send(posts);
});

app.post("/query/events", (req, res) => {
  const { type, data } = req.body;
  console.log("Recived Event",type);
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
      const res = await call("http://event-bus-srv:4005/event-bus/events");
      events = await JSON.parse(res["response"])
    } catch (error) {
      console.error("Error fetching events:", error.message);
    }

    for (const element of events) {
      HandelEvent(element.type, element.data);
    }
  }
});
