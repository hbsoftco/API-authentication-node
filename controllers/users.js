const { signUpValidation } = require('../validators/signUpValidator');

module.exports = {
    signUp: async (req, res, next) => {
        // Check inputs for validation
        let { error, value } = signUpValidation(req.body);

        if (error)
            res.json(error)

        if (!value) {
            value = {}
        }

        res.json(value);
        next();

    },

    signIn: async (req, res, next) => {
        console.log('signIn UserController');
    },

    secret: async (req, res, next) => {
        res.json({ 'msg': 'secret UserController' });
        console.log('secret UserController');
    }
}