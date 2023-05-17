const { INTERNAL_SERVER_ERROR } = require('../errors/constants');

module.exports.doError = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR } = err;
  const message = statusCode === INTERNAL_SERVER_ERROR ? 'Произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next(err);
};
