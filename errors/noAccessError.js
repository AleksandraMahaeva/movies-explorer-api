const { FORBIDDEN } = require('./constants');

class NoAccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

module.exports = NoAccessError;
