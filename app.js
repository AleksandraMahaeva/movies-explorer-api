require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const { doError } = require('./doError');
const { login, createUser, logout } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { usersRoutes } = require('./routes/users');
const { moviesRoutes } = require('./routes/movies');
const NotFoundError = require('./errors/notFoundError');

const { PORT = 3001 } = process.env;

const app = express();

const options = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

const routes = express.Router();

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

routes.use('/users', auth, usersRoutes);
routes.use('/movies', auth, moviesRoutes);
routes.use('/signout', auth, logout);
routes.use('*', auth, () => {
  throw new NotFoundError('Был запрошен несуществующий адрес');
});
app.use(routes);
app.use(errorLogger);
app.use(errors());
// app.use(doError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
