const rateLimiter = require('express-rate-limit');

exports.rateLimiter = rateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 200,
});
