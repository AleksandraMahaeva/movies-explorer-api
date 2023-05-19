const routes = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/validation');

routes.get('/me', getUser);
routes.patch('/me', updateUserValidation, updateUser);

module.exports.usersRoutes = routes;
