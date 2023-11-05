const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const { POST_CREATED } = require("../event-types");

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const posts = {};

/**
 * @method GET
 * @route /posts
 * @description Get all posts
 */
app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

/**
 * @method POST
 * @route /posts
 * @description Create a new post
 */
app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  // store post in memory
  posts[id] = {
    id,
    title,
  };

  try {
    // emit event to event bus
    await axios.post("http://localhost:4005/events", {
      type: POST_CREATED,
      data: { id, title },
    });
  } catch (error) {
    console.log(error);
  }

  res.status(201).send(posts[id]);
});


/**
 * @method POST 
 * @path /events
 * @description Receives events send by the event bus
 */
app.post('/events', (req, res) => {
    console.log('Event Received');
    res.status(200).send({})
});

app.listen(PORT, () => {
  console.log("Listening on 4000");
});
