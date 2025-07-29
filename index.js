// const exp = require('constants');
const express = require('express');
const rateLimit = require('express-rate-limit'); // Import rate limiting middleware
const app = express();
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize'); // Import mongo-sanitize to prevent NoSQL injection
const xss = require('xss-clean'); // Import xss-clean to prevent XSS attacks
const hpp = require('hpp'); // Import hpp to prevent HTTP parameter pollution
const globalErrorHandler = require('./controllers/errorHandler');
const dotenv = require('dotenv');
const AppError = require('./utils/indexError');
const helmet = require('helmet'); // Import helmet for security headers
const morgan = require('morgan');

// Middleware to parse JSON requests or reading the data from the body in to req.body
app.use(express.json({ limit: '10kb' })); // Required to parse JSON body

app.use(morgan('dev')); // Logging middleware
dotenv.config({ path: './config.env' }); // Load environment variables from config.env file
//Connec the database to the application

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(con.connections);
    console.log(`DB connection successful!`);
  });

// middleware to sanitize user input to prevent NoSQL injection attacks
app.use(mongoSanitize()); // Prevent NoSQL injection attacks by sanitizing user input

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'ratingsQuantity',
      'ratingAverage',
      'maxGroupSize',
    ], // Allow these parameters to be passed multiple times
  })
);
// Middleware to sanitize user input to prevent XSS attacks
app.use(xss()); // Prevent XSS attacks by sanitizing user input
//serve static files from the public directory
app.use(express.static(`${__dirname}/public`)); // Serve static files from 'public' directory

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Add request time to the request object
  console.log(`The headers: ${req.headers}`);
  next(); // Call the next middleware in the stack
});

app.use(helmet()); // Set security HTTP headers

const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use(limiter); // Apply rate limiting to all API routes

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Add request time to the request object
  console.log(`The headers: ${req.headers}`);
  next(); // Call the next middleware in the stack
});

const userRouter = require('./routes/userRouter');
const tourRouter = require('./routes/tourRouter');
const reviewRouter = require('./routes/reviewRouter'); // Import the review router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews',reviewRouter); // Use the review router for review-related routes

app.all('*', (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(error); // Pass the error to the next middleware
});


app.use(globalErrorHandler);
const port = process.env.PORT || 3000;

console.log('Environment:', process.env.NODE_ENV); // Log the current environment
if (process.env.NODE_ENV === 'development') {
  console.log('Development mode: Logging enabled');
  app.use(morgan('dev')); // Use morgan for logging in development mode
}

app
  .listen(port, () => {
    console.log(`App running on port ${port}...`);
  })
  .on('error', (err) => {
    console.error('Error starting server:', err);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.name, err.message);
  console.error('Shutting down server due to unhandled rejection...');
  server.close(() => {
    process.exit(1); // Exit the process with a failure code
  });
  // Exit the process with a failure code
});
