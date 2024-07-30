require('dotenv').config('../.env');
// require('./connection/db');

const express = require('express');
const app = express();
const http = require('http');

const { PORT } = require('../config/key');

// Parse request data to json
app.use(express.json());

server = http.createServer(app)
server.listen(PORT, () => {
    console.log('Server listening on port:', PORT)
});

app.get('/', (req, res) => {
    res.send('Testing from the node service.');
});

// Api routes
// const commonRoute = require('./routes/common.routes');
// app.use(commonRoute);

app.use('*', (req, res, next) => {
    res.status(404).json({
        success: 'false',
        message: 'Page not found',
        error: {
            statusCode: 404,
            message: 'You reached a route that is not defined on this server',
        },
    });
})
