const jwt = require('jsonwebtoken');
const AuthorizError = require('../errors/authorizError');

const { NODE_ENV, JWT_SECRET } = process.env;
const key = NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key';

module.exports = (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) throw new AuthorizError('Необходима авторизация');
  let payload;

  try {
    payload = jwt.verify(token, key);
  } catch (err) {
    throw new AuthorizError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
