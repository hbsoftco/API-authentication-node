const router = require('express-promise-router')();
const passport = require('passport');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogleToken = passport.authenticate('googleToken', { session: false });
const passportFacebookToken = passport.authenticate('facebookToken', { session: false });
const passportGithubToken = passport.authenticate('githubToken', { session: false });
const passportGitlabToken = passport.authenticate('gitlabToken', { session: false });
const passportBitbucketToken = passport.authenticate('bitbucketToken', { session: false });

// Validators
const { signUpValidation, schema } = require('../validators/signUpValidator');
// Controllers
const UserController = require('../controllers/users');

// Routes
router.route('/').get(UserController.index);
router.route('/secret').get(passportJWT, UserController.secret);
router.route('/:id').get(UserController.show);
router.route('/:id').put(UserController.update);
router.route('/:id').delete(UserController.destroy);
router.route('/signup').post(signUpValidation(schema.authSchema), UserController.signUp);
router.route('/signin').post(signUpValidation(schema.authSchema), passportSignIn, UserController.signIn);
router.route('/oauth/google').post(passportGoogleToken, UserController.googleOAuth);
router.route('/oauth/facebook').post(passportFacebookToken, UserController.facebookOAuth);
router.route('/oauth/github').post(passportGithubToken, UserController.githubOAuth);
router.route('/oauth/gitlab').post(passportGitlabToken, UserController.gitlabOAuth);
router.route('/oauth/bitbucket').post(passportBitbucketToken, UserController.bitbucketOAuth);

module.exports = router;