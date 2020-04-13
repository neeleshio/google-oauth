//packages
const express = require('express');
const app = express();
//app.listen(3000)
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-plus-token');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const Sequelize = require('sequelize');
const router = require('express-promise-router')();
const JWT = require('jsonwebtoken');

//controllers
signToken = user => {
    return JWT.sign({
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, 'secret');
};

const controller = {
    googleOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    secret: async (req, res, next) => {
        res.status(200).json({ secret: "Its Working" });
    }
};

//database & the app route
const db = new Sequelize('database', 'username', 'password', {
    host: '',
    dialect: /* one of */ 'mysql' | 'mariadb' | 'postgres' | 'mssql' 
});
db.authenticate()
    .then(() => console.log('Db connected...'))
    .catch(err => console.log('Error: ' + err));

app.use(express.json());
app.use(bodyParser.json());
app.use('/users', router.post('/oauth/google', passport.authenticate('googleToken', { session: false }), controller.googleOAuth));
app.use('/secret', router.get('/secret', passport.authenticate('jwt', { session: false }), controller.secret));

//model Schema
const User = db.define('users', {
    name: {
        type: Sequelize.TEXT
    },
    email: {
        type: Sequelize.STRING,
        lowercase: true
    }
});

//authentication
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'secret'
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
    clientID: '/*google api client id*/',
    clientSecret: '/*google api client secret*/'
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
