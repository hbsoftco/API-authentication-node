const router = require('express-promise-router')();

// Controllers
const UserController = require('../controllers/users');

// Routes
router.route('/signup').post(UserController.signUp);
router.route('/signin').post(UserController.signIn);
router.route('/secret').get(UserController.secret);

module.exports = router;