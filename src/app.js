const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const auth = require('./middlewares/auth');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Set EJS sebagai template engine
app.set('view engine', 'ejs');
app.set('views', path.join(`${__dirname}/views`)); // Mengatur direktori views

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// Use method-override middleware
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  console.log('Received Cookies: ', req.cookies); // Ini akan mencetak semua cookies yang diterima
  next();
});

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('src/views'));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.use(cookieParser());
// jwt authentication
app.use(cookieParser());
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);
app.use(methodOverride('_method'));
// send back a 404 error for any unknown api request
// app.use((req, res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
// });

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
