const { UNAUTHORIZED } = require('./constants');

class AuthorizError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = AuthorizError;
