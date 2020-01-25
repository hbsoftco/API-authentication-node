const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
// Defining the PORT
const PORT = process.env.PORT || 5000;

// Middllwares
app.use(logger('dev'));
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/users'))

// Start the server
app.listen(PORT, () => {
    console.log('Server run at http://localhost:5000');
});
