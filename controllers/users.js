const { signUpValidation } = require('../validators/signUpValidator');

module.exports = {
    signUp: async (req, res, next) => {
        console.log('ok');


    },

    signIn: async (req, res, next) => {
        console.log('signIn UserController');
    },

    secret: async (req, res, next) => {
        res.json({ 'msg': 'secret UserController' });
        console.log('secret UserController');
    }
}