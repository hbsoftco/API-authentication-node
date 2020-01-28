const JwtStrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local').Strategy;
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
            try {
                // Find the user given the email
                const user = await User.findOne({ email });

                // If not, handle it
                if (!user) {
                    return done(null, false);
                }

                //////// old version
                User.comparePassword(password, user.password, (err, isMatch) => {
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
