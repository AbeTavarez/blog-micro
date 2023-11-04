const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const posts = {};

/**
 * @method GET
 * @route /posts
 * @description Get all posts
 */
app.get('/posts', (req, res) => {
    res.status(200).send(posts);
});

/**
 * @method POST
 * @route /posts
 * @description Create a new post
 */
app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    res.status(201).send(posts[id]);
});

app.listen(4000, () => {
  console.log('Listening on 4000');
});