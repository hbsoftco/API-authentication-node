const { signUpValidation } = require('../validators/signUpValidator');

module.exports = {
    signUp: async (req, res, next) => {
        let result = signUpValidation(req.body);

        res.json(result);


        console.log('SignUp UserController');


    },

    signIn: async (req, res, next) => {
        console.log('signIn UserController');
    },

    secret: async (req, res, next) => {
        res.json({ 'msg': 'secret UserController' });
        console.log('secret UserController');
    }
}