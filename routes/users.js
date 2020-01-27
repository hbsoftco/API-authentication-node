const router = require('express-promise-router')();
const passport = require('passport');
// Validators
const { signUpValidation, schema } = require('../validators/signUpValidator');
// Controllers
const UserController = require('../controllers/users');

// Routes
router.route('/signup').post(signUpValidation(schema.authSchema), UserController.signUp);
router.route('/signin').post(UserController.signIn);
router.route('/secret').get(passport.authenticate('jwt', { session: false }), UserController.secret);

module.exports = router;