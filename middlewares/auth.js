const jwt = require('jsonwebtoken');
const AuthorizError = require('../errors/authorizError');
const { JWT_SECRET } = require('../config');
const { messages } = require('../messages');

const { notAuthMessage } = messages;

module.exports = (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) throw new AuthorizError(notAuthMessage);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthorizError(notAuthMessage);
  }

  req.user = payload;
  return next();
};
