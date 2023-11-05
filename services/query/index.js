const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json());
app.use(morgan('dev'));

const posts= {};

/**
 * @method GET 
 * @path /posts
 * @description Send all posts with the posts's comments
 */
app.get('/posts', (req, res) => {
    res.status(200).send(posts);
});


/**
 * @method POST  
 * @path /events
 * @description Receives data from event-bus to be added to data structure/db
 */
app.post('/events', (req, res) => {
    const {type, data} = req.body.event;
    console.log(req.body);
    console.log(type === 'PostCreated');

    if (type === 'PostCreated') {
        console.log('matched');
        const {id, title} = data;
        posts[id] = {id, title, comments: []} // add post to posts object
    }

    if (type === 'CommentCreated') {
        const {id, content, postId} = data;
        posts[postId].comments.push({id, content}); // add post to posts object
    }

    console.log(posts);
    res.status(200).send({msg: 'data added successfully!'});
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})