const routes = require('express').Router();
const { usersRoutes } = require('./users');
const { moviesRoutes } = require('./movies');
const NotFoundError = require('../errors/notFoundError');
const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');
const { signUpValidation, signInValidation } = require('../middlewares/validation');

routes.post('/signup', signUpValidation, createUser);
routes.post('/signin', signInValidation, login);

routes.use('/users', auth, usersRoutes);
routes.use('/movies', auth, moviesRoutes);
routes.use('/signout', auth, logout);
routes.use('*', auth, () => {
  throw new NotFoundError('Был запрошен несуществующий адрес');
});

exports.routes = routes;
