const routes = require('express').Router();
const { usersRoutes } = require('./users');
const { moviesRoutes } = require('./movies');
const NotFoundError = require('../errors/notFoundError');
const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');
const { signUpValidation, signInValidation } = require('../middlewares/validation');
const { messages } = require('../messages');

const { notFoundUrlMessage } = messages;

routes.post('/signup', signUpValidation, createUser);
routes.post('/signin', signInValidation, login);

routes.use('/users', auth, usersRoutes);
routes.use('/movies', auth, moviesRoutes);
routes.use('/signout', auth, logout);
routes.use('*', auth, () => {
  throw new NotFoundError(notFoundUrlMessage);
});

exports.routes = routes;
