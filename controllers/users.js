const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const UniqueError = require('../errors/uniqueError');
const AuthorizError = require('../errors/authorizError');

const notFoundUserMessage = 'Пользователь не найден';
const { NODE_ENV, JWT_SECRET } = process.env;
const isProduction = NODE_ENV === 'production';
const key = isProduction ? JWT_SECRET : 'some-secret-key';

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
      if (err.code === 11000) next(new UniqueError('Пользаватель с таким Email уже существует'));
      else if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      else next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  const userId = req.params.userId || req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) throw new NotFoundError(notFoundUserMessage);
      else res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new ValidationError('Передан некорректный id пользователя'));
      else next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError(notFoundUserMessage);
      else res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new AuthorizError('Неправильные почта или пароль');

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizError('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            key,
            { expiresIn: '7d' },
          );
          res.cookie('userToken', token, {
            maxAge: '3600000',
            httpOnly: true,
            sameSite: false,
            secure: isProduction,
          }).send({ message: 'Вы успешно авторизовались' });
        });
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  const token = req.cookies.userToken;

  if (!token) {
    throw new AuthorizError('Вы не авторизованы в системе');
  }

  try {
    res
      .clearCookie('userToken', {
        httpOnly: true,
        sameSite: true,
      })
      .status(200)
      .send({ message: 'Вы успешно разовторизовались' });
  } catch (err) {
    next(err);
  }
};
