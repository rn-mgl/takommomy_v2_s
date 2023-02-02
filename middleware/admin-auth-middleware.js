const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Admin__Bearer__Token")) {
    throw new UnauthenticatedError(`You are not authorized to access this page.`);
  }

  const token = header.split(" ")[1];

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  req.user = {
    id: decode.id,
    name: decode.name,
    surname: decode.surname,
    email: decode.email,
  };

  next();
};

module.exports = adminAuthMiddleware;
