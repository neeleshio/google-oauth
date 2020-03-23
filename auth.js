const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-plus-token');
const User = require('./models/User');
const oath = require('./config/oath');

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