const AppError = require('../utils/indexError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const hadleDuplicateError = (err) => {
  const message = `Duplicate field value: Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationError = (err) => {
  const message = 'Validation error';
  return new AppError(message, 400);
};

const sendErrorProd = (err, res) => {
  // let error={...err}
  if (res.headersSent) {
    // If headers are already sent, do not try to send another response
    return;
  }
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
      err: err,
    });
  }
};

const sendErrorDev = (err, res) => {
  if (res.headersSent) {
    // If headers are already sent, do not try to send another response
    return;
  }
  res.status(err.statusCode || 500).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
    err: err,
  });
};
const handlJsonWebTokenError = (err) => {
  const message = 'Invalid token! Please login again.';
  return new AppError(message, 401);
};

module.exports = (err, req, res, next) => {
  console.error('Error:', err.message); // Log the error message
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      err = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      err = hadleDuplicateError(err);
    }
    if (err.name === 'ValidationError') {
      err = handleValidationError(err);
    }
    if (err.name === 'JsonWebTokenError') {
      // return next(new AppError('Invalid token! Please login again.', 401));
      err=handlJsonWebTokenError(err);
    }
    if(err.name === 'TokenExpiredError') {
      const message = 'Your token has expired! Please log in again.';
      err = new AppError(message, 401);
    }
    }
    sendErrorProd(err, res);
  };

  