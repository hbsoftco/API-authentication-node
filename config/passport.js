const JwtStrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const GitHubTokenStrategy = require('passport-github-token');
const GitLabTokenStrategy = require('passport-gitlab-token').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const { secret } = require('../config/database');

module.exports = (passport) => {

    // To authenticate the User by JWT Strategy
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = secret;

    passport.use(new JwtStrategy(opts,
        async (jwt_payload, done) => {
            User.getUserById(jwt_payload.data._id,
                (err, user) => {
                    if (err) return done(err, false);
                    // Find the user specified in token
                    if (user) return done(null, user);
                    // User dosn't exist
                    return done(null, false);
                })
        }));

    // To authenticate the User by local Strategy
    let optsLocal = {};
    optsLocal.usernameField = 'email';

    passport.use(new localStrategy(optsLocal,
        async (email, password, done) => {
            console.log(email);
            try {
                // Find the user given the email
                const user = await User.findOne({ "local.email": email });
                // For mysql
                // const user = await User.findOne({ email });

                // If not, handle it
                if (!user) {
                    return done(null, false);
                }

                //////// old version
                User.comparePassword(password, user.local.password, (err, isMatch) => {

                    console.log(isMatch);

                    if (err) throw err;
                    if (isMatch) {
                        done(null, user);

                    } else {
                        if (!isMatch) {
                            return done(null, false);
                        }
                    }
                });


                ////////////////// New method for future

                // Check if the password is correct
                // const isMatch = await User.isValidPassword(password);

                // // If not, handle it
                // if (!isMatch) {
                //     return done(null, false);
                // }

                // // Otherwise, return the user
                // done(null, user);

            } catch (error) {
                done(error, false);
            }
        }));

    // To authenticate the User by Google OAuth Strategy
    passport.use('googleToken', new GooglePlusTokenStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {

            // Check whether this current user exists in our DB
            const existingUser = await User.findOne({ 'google.id': profile.id })
            if (existingUser) {
                console.log(`User already exists in our DB`);
                return done(null, existingUser);
            }

            console.log(`User doesn't exists, we're creating a new one`);

            // If new account
            const email = '';
            if (profile.emails.length) {
                email = profile.emails[0].value
            }

            const newUser = new User({
                method: 'google',
                google: {
                    id: profile.id,
                    email: email
                }

            });

            await newUser.save();
            done(null, newUser);
        } catch (error) {
            done(error, false, error.message);
        }


    }));

    // To authenticate the User by Facebook OAuth Strategy
    passport.use('facebookToken', new FacebookTokenStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET
    }, async (accessToken, refreshToken, profile, done) => {
        try {

            // Check whether this current user exists in our DB
            const existingUser = await User.findOne({ 'facebook.id': profile.id })
            if (existingUser) {
                console.log(`User already exists in our DB`);
                return done(null, existingUser);
            }

            console.log(`User doesn't exists, we're creating a new one`);

            // If new account
            const email = '';
            if (profile.emails[0].value !== '') {
                email = profile.emails[0].value
            }


            const newUser = new User({
                method: 'facebook',
                facebook: {
                    id: profile.id,
                    email: email
                }

            });

            await newUser.save();
            done(null, newUser);
        } catch (error) {
            done(error, false, error.message);
        }
    }
    ));

    // To authenticate the User by Github OAuth Strategy
    passport.use('githubToken', new GitHubTokenStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {

            // Check whether this current user exists in our DB
            const existingUser = await User.findOne({ 'github.id': profile.id })
            if (existingUser) {
                console.log(`User already exists in our DB`);
                return done(null, existingUser);
            }

            console.log(`User doesn't exists, we're creating a new one`);

            // If new account
            const email = profile.emails[0].value;

            const newUser = new User({
                method: 'github',
                github: {
                    id: profile.id,
                    email: email
                }

            });

            await newUser.save();
            done(null, newUser);
        } catch (error) {
            done(error, false, error.message);
        }

    }));

    // To authenticate the User by GitLab OAuth Strategy
    passport.use('gitlabToken', new GitLabTokenStrategy({
        clientID: process.env.GITLAB_CLIENT_ID,
        clientSecret: process.env.GITLAB_CLIENT_SECRET
    },
        async (accessToken, refreshToken, profile, done) => {
            try {

                // Check whether this current user exists in our DB
                const existingUser = await User.findOne({ 'gitlab.id': profile.id })
                if (existingUser) {
                    console.log(`User already exists in our DB`);
                    return done(null, existingUser);
                }

                console.log(`User doesn't exists, we're creating a new one`);

                // If new account
                const email = profile.email;

                const newUser = new User({
                    method: 'gitlab',
                    gitlab: {
                        id: profile.id,
                        email: email
                    }

                });

                await newUser.save();
                done(null, newUser);
            } catch (error) {
                done(error, false, error.message);
            }
        }
    ));

}
