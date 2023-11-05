const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const PORT = 4005;

app.use(express.json());
app.use(morgan('dev'));
// app.use(cors());

/**
 * @method POST 
 * @router /events
 * @emits event to services
 * @description Takes in events and echos event to services
 */
app.post('/events', (req, res) => {
    const event = req.body;

    try {
        axios.post('http://localhost:4000/events', {event});
        axios.post('http://localhost:4001/events', {event});
        // axios.post('http://localhost:4002/events', {event});

        res.status(200).send({status: 'OK'});
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
})