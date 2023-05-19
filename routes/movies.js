const routes = require('express').Router();
const { createMovieValidation, deleteMovieValidation } = require('../middlewares/validation');
const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');

routes.post('/', createMovieValidation, createMovie);
routes.get('/', getMovies);
routes.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports.moviesRoutes = routes;
