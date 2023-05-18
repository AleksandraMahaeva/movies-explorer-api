const { INTERNAL_SERVER_ERROR } = require('../errors/constants');
const { messages } = require('../messages');

const { commonErrorMessage } = messages;

module.exports.doError = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR } = err;
  const message = statusCode === INTERNAL_SERVER_ERROR ? commonErrorMessage : err.message;
  res.status(statusCode).send({ message });
  next(err);
};
