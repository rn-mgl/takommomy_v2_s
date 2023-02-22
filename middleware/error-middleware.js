const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Sorry, we are currently having internal errors. Try again later.",
  };

  if (err.name === "CastError") {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.msg = `No order found with the id ${err.value.id || err.value}`;
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = 400;
    customError.msg = `Value entered for ${Object.keys(err.keyValue)} already exists.`;
  }

  res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
