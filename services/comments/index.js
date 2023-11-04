const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.status(200).send(commentsByPostId[req.params.id] || []);
});


app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    // If the commentsByPostId object does not have a key of req.params.id, then set it equal to an empty array
    const comments = commentsByPostId[req.params.id] || [];

    // Push the new comment into the comments array
    comments.push({ id: commentId, content });

    // Set the comments array as the value of the key req.params.id
    commentsByPostId[req.params.id] = comments;

    res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});