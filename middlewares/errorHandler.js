export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;
  if (err.code === 11000) {
    res.status(err.statusCode).json({
      success: false,
      message: `${
        Object.keys(err.keyValue).toString().charAt(0).toUpperCase() +
        Object.keys(err.keyValue).toString().slice(1)
      } is duplicated`,
    });
  } else {
    res.status(err.statusCode).json({ success: false, message: err.message });
  }
  console.log(err.statusCode)
};

export const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next).catch(next));
  };
};
