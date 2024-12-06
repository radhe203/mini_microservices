import express from "express";
import call from "./call.js";

const app = express();
app.use(express.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;

  events.push(event);

  try {
    await call("http://localhost:4000/events", "POST", {}, event);
  } catch (error) {
    console.log(error);
  }

  try {
    await call("http://localhost:4001/events", "POST", {}, event);
  } catch (error) {
    console.log(error);
  }

  try {
    await call("http://localhost:4002/events", "POST", {}, event);
  } catch (error) {
    console.log(error);
  }

  try {
    await call("http://localhost:4003/events", "POST", {}, event);
  } catch (error) {
    console.log(error);
  }

  res.sendStatus(200);
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 4005 !!");
  }
});
