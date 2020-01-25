module.exports = {
    signUp: async (req, res, next) => {
        console.log(req.value.body);
        
    },

    signIn: async (req, res, next) => {
        console.log('signIn UserController');
    },

    secret: async (req, res, next) => {
        res.json({ 'msg': 'secret UserController' });
        console.log('secret UserController');
    }
}