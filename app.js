const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv').config()

// Initialize the app
const app = express();
// Defining the PORT
const PORT = process.env.PORT || 5000;

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

// Middllwares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());
// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// Swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'API Authentication',
            description: 'Customer API Information',
            contact: {
                name: 'HBSOFTCO'
            },
            servers: ['http://localhost:5000/']
        }
    },
    // ['.routes/*.js']
    apis: ['app.js']
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Bring in the passport authenticaion strategy
require('./config/passport')(passport);

// Routes
app.use('/users', require('./routes/users'))

// Start the server
// app.listen(PORT, () => {
//     console.log('Server run at http://localhost:5000');
// });

// Run the server!
const start = async () => {
    try {
        await app.listen(PORT);
        console.log('Server run at http://localhost:5000');

    } catch (err) {

    }
}

start();
