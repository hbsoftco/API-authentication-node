const JwtStrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local').Strategy;
var GooglePlusTokenStrategy = require('passport-google-plus-token');
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


    // To authenticate the User by Google OAuth Strategy
    passport.use('googleToken', new GooglePlusTokenStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile);
            // return;

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
}
