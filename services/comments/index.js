const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");

const app = express();
const PORT = 4001;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const commentsByPostId = {};


/**
 * @method GET
 * @route /posts/:id/comments
 * @description Get comments by post id
 */
app.get("/posts/:id/comments", (req, res) => {
  res.status(200).send(commentsByPostId[req.params.id] || []);
});


/**
 * @method POST
 * @route /posts/:id/comments
 * @description Create comment by post id
 * @emits "CommentCreated" to the event bus
 */
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  // If the commentsByPostId object does not have a key of req.params.id, then set it equal to an empty array
  const comments = commentsByPostId[req.params.id] || [];

  // Push the new comment into the comments array
  comments.push({ id: commentId, content, status: "pending" });

  // Set the comments array as the value of the key req.params.id
  commentsByPostId[req.params.id] = comments;

  try {
    // emit event to event bus
    await axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });
  } catch (error) {
    console.log(error);
  }

  res.status(201).send(comments);
});

/**
 * @method POST
 * @endpoint /events
 * @description Receives events send by the event bus
 */
app.post("/events", async (req, res) => {
  console.log("Event Received: ", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { id, postId, content, status } = data;
    // get all comment by postId
    const comments = commentsByPostId[postId];

    // find the comment to update
    const comment = comments.find((comment) => comment.id === id);

    // update the comment's status
    comment.status = status;

    console.log('COMMENT MODERATED: ', comment);

    try {
      await axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          status,
          postId,
          content
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  res.status(200).send({});
});

app.listen(PORT, () => {
  console.log("Listening on 4001");
});
