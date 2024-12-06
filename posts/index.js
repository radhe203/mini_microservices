import express from "express";
import { randomBytes } from "crypto";
import cors from "cors";
import call from "./call.js";

const app = express();
app.use(cors());
app.use(express.json());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const { tittle } = req.body;

  const id = randomBytes(4).toString("hex");

  posts[id] = {
    id,
    tittle,
  };

  try {
    const eventResponse = await call(
      "http://localhost:4005/events",
      "POST",
      {},
      {
        type: "PostCreated",
        data: { id, tittle },
      }
    );
    console.log("Event Response:", eventResponse);

    res.status(201).send(posts);
  } catch (error) {
    console.error("Error dispatching event:", error.message);
    res.status(500).send({ error: "Failed to create post" });
  }

});

app.post("/events", (req, res) => {
  console.log("Recived Event", req.body);
  res.send({});
});

app.listen(4000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 4000 !!");
  }
});
