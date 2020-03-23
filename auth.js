const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-plus-token');
const User = require('./models/User');
const oath = require('./config/oath');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: oath.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findOne({ where: { id: payload.sub } });
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
}));


passport.use('googleToken', new GoogleTokenStrategy({
    clientID: 'oath.google.clientID',
    clientSecret: 'oath.google.clientSecret'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);

        let existingUser = await User.findOne({ where: { email: profile.emails[0].value } });
        if (existingUser) {
            console.log('existing user');
            return done(null, existingUser);
        }

        console.log('new user');
        const newUser = new User({
            name: profile.displayName,
            // gid: profile.id,
            email: profile.emails[0].value
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message)
    }
}));

module.exports = passport;