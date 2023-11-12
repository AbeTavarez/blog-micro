const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const PORT = 4005;

app.use(express.json());
app.use(morgan('dev'));

// data store
const eventsStore = [];

/**
 * @method GET 
 * @route /events
 * @description Send all events stored in the event store
 */
app.get('/events', (req, res) => {
    res.status(200).send(eventsStore);
});


/**
 * @method POST 
 * @route /events
 * @emits event to services
 * @description Takes in events and echos event to services
 */
app.post('/events', (req, res) => {
    const event = req.body;
    console.log("EVENT BUS Event: ", event);

    // add event to event store
    eventsStore.push(event);

        axios.post('http://posts-clusterip-srv:4000/events', event).catch(err => {
            console.log(err.message);
        });
        axios.post('http://comments-srv/events', event).catch(err => {
            console.log(err.message);
        });
        axios.post('http://query-srv:4002/events', event).catch(err => {
            console.log(err.message);
        });
        axios.post('http://moderation-srv:4003/events', event).catch(err => {
            console.log(err.message);
        });

        res.status(200).send({status: 'OK'});
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
})