const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require('axios');
// const handleEvent = require("./utils/handleEvent");

const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const posts = {};

/**
 * @method GET
 * @path /posts
 * @description Send all posts with the posts's comments
 */
app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

/**
 * @method POST
 * @path /events
 * @description Receives data from event-bus to be added to data structure/db
 */
app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log("QUERY EVENT TYPE: ", type);

  // process events and perform data updates
  handleEvent(type, data);

  res.status(200).send({ msg: "data added successfully!" });
});

//* === Listener
app.listen(PORT, async () => {
  console.log(`Listening on port: ${PORT}`);

  try {
    // makes request to event bus to get all events
  const res = await axios.get('http://event-bus-srv:4005/events');

  // process every event from event bus data store
  for (let event of res.data) {
    console.log('Processing event: ', event.type);
    handleEvent(event.type, event.data);
  }
  } catch (error) {
    console.log(error.message);
  }

});

function handleEvent(type, data) {
    //* Post Created
    if (type === "PostCreated") {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
    }
  
    //* Comment Created
    if (type === "CommentCreated") {
      const { id, content, postId, status } = data;
  
      const post = posts[postId];
      post.comments.push({ id, content, status });
    }
  
    //* Comment Updated
    if (type === "CommentUpdated") {
      const { id, content, postId, status } = data;
      // get post by postId
      const post = posts[postId];
  
      // find comment to updates
      const comment = post.comments.find((comment) => comment.id === id);
  
      // update comment
      comment.status = status;
      comment.content = content;
      console.log(comment);
    }
  }