const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
const {COMMENT_CREATED} = require('../event-types');

const app = express();
const PORT = 4001;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.status(200).send(commentsByPostId[req.params.id] || []);
});


app.post('/posts/:id/comments', async(req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    // If the commentsByPostId object does not have a key of req.params.id, then set it equal to an empty array
    const comments = commentsByPostId[req.params.id] || [];

    // Push the new comment into the comments array
    comments.push({ id: commentId, content });

    // Set the comments array as the value of the key req.params.id
    commentsByPostId[req.params.id] = comments;

    try {
      // emit event to event bus
      await axios.post("http://localhost:4005/events", {
        type: COMMENT_CREATED,
        data: { 
          id: commentId,
          content,
          postId: req.params.id
        },
      });
    } catch (error) {
      console.log(error);
    }

    res.status(201).send(comments);
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
  console.log('Listening on 4001');
});