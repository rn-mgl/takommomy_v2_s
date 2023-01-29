const BadRequestError = require("./bad-request-error");
const CustomAPIError = require("./custom-api-error");
const UnauthenticatedError = require("./unauthenticated-error");
const NotFoundError = require("./not-found-error");

module.exports = { BadRequestError, CustomAPIError, UnauthenticatedError, NotFoundError };
