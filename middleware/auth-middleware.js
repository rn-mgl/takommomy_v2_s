const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthenticatedError(
      `You are not authorized to access this. You are neither logged in or an admin.`
    );
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

module.exports = authMiddleware;
