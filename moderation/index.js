import express from "express";
import call from "./call.js";

const app = express();
app.use(express.json());

app.post("/moderation/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("Recived Event",type);
  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    try {
      await call(
        "http://event-bus-srv:4005/event-bus/events",
        "POST",
        {},
        {
          type: "CommentModerated",
          data: {
            id: data.id,
            content: data.content,
            postId: data.postId,
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

app.listen(4003, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 4003 !!");
  }
});
