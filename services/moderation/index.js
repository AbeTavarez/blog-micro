const express = require("express");
const axios = require("axios");
const morgan = require("morgan");

const app = express();
const PORT = 4003;

app.use(express.json());
app.use(morgan("dev"));

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log(req.body);

  if (type === "CommentCreated") {
    //TODO: "perform moderation"
    const status = data.content.includes("monolithic")
      ? "rejected"
      : "approved";

    try {
      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status: status,
          content: data.content,
        },
      });

      res.send("ok");
    } catch (error) {
      console.log(error.message);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
