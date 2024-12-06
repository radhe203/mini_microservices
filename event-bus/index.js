import express from "express";
import call from "./call.js";

const app = express();
app.use(express.json());

const events = [];

app.post("/event-bus/events", async (req, res) => {
  const event = req.body;
  console.log("Recived Event",event.type);
  events.push(event);

  try {
    await call("http://posts-srv:4000/posts/events", "POST", {}, event);
  } catch (error) {
    console.log(error);
  }

  try {
    await call("http://comments-srv:4001/comments/events", "POST", {}, event);
  } catch (error) {
    console.log(error);
  }

  try {
    await call("http://query-srv:4002/query/events", "POST", {}, event);
  } catch (error) {
    console.log(error);
  }

  try {
    await call("http://moderation-srv:4003/moderation/events", "POST", {}, event);
  } catch (error) {
    console.log(error);
  }

  res.sendStatus(200);
});

app.get("/event-bus/events", (req, res) => {
  res.send(events);
});

app.listen(4005, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 4005 !!");
  }
});
