const express = require('express');
const router = require('express-promise-router')();
const passport = require('../auth');
const userController = require('../controller/users');

router.route('/oauth/google')
    .post(passport.authenticate('googleToken', { session: false }), userController.googleOAuth);

module.exports = router;