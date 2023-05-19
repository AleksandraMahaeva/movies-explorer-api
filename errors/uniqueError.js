const { CONFLICT } = require('./constants');

class UniqueError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

module.exports = UniqueError;
