const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const { default: validator } = require('validator');

function validateURL(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Заполните поле валидным URL');
}

const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
    name: Joi.string().required().min(2).max(30),
  }),
});

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    trailer: Joi.string().required().custom(validateURL),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.number().integer().required(),
  }),
});

const deleteMovieValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.objectId(),
  }),
});

module.exports = {
  signUpValidation,
  signInValidation,
  updateUserValidation,
  createMovieValidation,
  deleteMovieValidation,
};
