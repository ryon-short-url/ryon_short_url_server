const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const keys = require('../untils/key');

//Using google auth
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "https://ryon-server-ovm2v4omga-as.a.run.app/auth/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));