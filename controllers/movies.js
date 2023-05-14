const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const NoAccessError = require('../errors/noAccessError');

const notFoundMovieMessage = 'Фильм не найден';

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные'));
      else next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError(notFoundMovieMessage);
    })
    .then((movie) => {
      if (movie.owner.toString() !== userId) throw new NoAccessError('Нет прав для удаления');
      return Movie.findByIdAndRemove(movieId).then(() => res.send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new ValidationError('Переданы некорректные данные'));
      else next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => res.send(movies))
    .catch(next);
};
