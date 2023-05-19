require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { doError } = require('./middlewares/doError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { routes } = require('./routes');
const { rateLimiter } = require('./middlewares/rateLimiter');
const { PORT, DB_ADDRESS, CORS_OPTIONS } = require('./config');

const app = express();

app.use(helmet());

app.use('*', cors(CORS_OPTIONS));

mongoose.connect(DB_ADDRESS, { useNewUrlParser: true });

app.use(requestLogger);
app.use(rateLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(doError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
