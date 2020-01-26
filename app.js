const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Bring in the database object
const config = require('./config/database');

// Mongodb config
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// Connect with the database
mongoose.connect(config.database, { useNewUrlParser: true })
    .then(() => {
        console.log('database connect successfully ' + config.database);
    }).catch(err => {
        console.log(err);
    });

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
