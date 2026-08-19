// Wraps async route handlers so rejected promises are passed to Express error middleware
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
