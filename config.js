const {
  PORT = 3001,
  DB_ADDRESS = 'mongodb://localhost:27017/bitfilmsdb',
  JWT_SECRET = 'jwt-secret-key',
} = process.env;

const CORS_OPTIONS = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = {
  PORT,
  DB_ADDRESS,
  JWT_SECRET,
  CORS_OPTIONS,
};
