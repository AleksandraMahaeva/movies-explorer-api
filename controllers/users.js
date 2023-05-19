const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const UniqueError = require('../errors/uniqueError');
const AuthorizError = require('../errors/authorizError');
const { SUCCESS, DUPLICATE_KEY } = require('../errors/constants');
const { JWT_SECRET } = require('../config');
const { messages } = require('../messages');

const {
  notFoundUserMessage,
  emailUniqueMessage,
  userValidationMessage,
  authValidationMessage,
  notAuthMessage,
  loginnSuccessMessage,
  logoutSuccessMessage,
} = messages;

const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === 'production';

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.send({
      name, email,
    }))
    .catch((err) => {
      if (err.code === DUPLICATE_KEY) next(new UniqueError(emailUniqueMessage));
      else if (err.name === 'ValidationError') next(new ValidationError(userValidationMessage));
      else next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError(notFoundUserMessage);
      else res.send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError(notFoundUserMessage);
      else res.send(user);
    })
    .catch((err) => {
      if (err.code === DUPLICATE_KEY) next(new UniqueError(emailUniqueMessage));
      else if (err.name === 'ValidationError' || err.name === 'CastError') next(new ValidationError(userValidationMessage));
      else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new AuthorizError(authValidationMessage);

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizError(authValidationMessage);
          }
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          res.cookie('userToken', token, {
            maxAge: '3600000',
            httpOnly: true,
            sameSite: false,
            secure: isProduction,
          }).send({ message: loginnSuccessMessage });
        });
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  const token = req.cookies.userToken;

  if (!token) {
    throw new AuthorizError(notAuthMessage);
  }

  try {
    res
      .clearCookie('userToken', {
        httpOnly: true,
        sameSite: true,
      })
      .status(SUCCESS)
      .send({ message: logoutSuccessMessage });
  } catch (err) {
    next(err);
  }
};
