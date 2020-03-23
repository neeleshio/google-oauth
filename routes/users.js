const express = require('express');
const router = require('express-promise-router')();
const passport = require('../auth');
const userController = require('../controller/users');
const passpostJwt = passport.authenticate('jwt', { session: false })

router.route('/oauth/google')
    .post(passport.authenticate('googleToken', { session: false }), userController.googleOAuth);

router.get('/secret', passpostJwt, userController.secret);

module.exports = router;