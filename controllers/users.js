const JWT = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/database');

module.exports = {
    signUp: async (req, res, next) => {

        let newUser = new User(
            { email, password } = req.value.body
        );

        User.addUser(newUser, (err, user) => {
            if (err) {
                let message = "";
                if (err.errors.username) message = "Username is already taken.";
                if (err.errors.email) message += "Email already taken.";
                return res.json({
                    success: false,
                    message
                });
            } else {
                const token = JWT.sign({
                    type: "user",
                    data: user
                }, secret, {
                    expiresIn: 604800 // for 1 week timein milliseconds
                });

                return res.json({
                    success: true,
                    token: 'JWT ' + token,
                    message: "User registration successful."
                })
            }
        });

    },

    signIn: async (req, res, next) => {
        console.log('signIn UserController');
    },

    secret: async (req, res, next) => {
        res.json({ 'msg': 'secret UserController' });
        console.log('secret UserController');
    }
}