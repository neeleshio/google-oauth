const JWT = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/oath');

signToken = user => {
  return JWT.sign({
    iss: 'LivingHeritage',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, JWT_SECRET);
};

module.exports = {
  googleOAuth: async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({ token });
  }
};



