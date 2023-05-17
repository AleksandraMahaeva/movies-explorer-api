const jwt = require('jsonwebtoken');
const AuthorizError = require('../errors/authorizError');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) throw new AuthorizError('Необходима авторизация');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthorizError('Необходима авторизация');
  }

  req.user = payload;
  return next();
};
