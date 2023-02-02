const Users = require("../models/Users");
const { UnauthenticadError, BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { isEmail } = require("validator");
const sendEmail = require("./mail-controller");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, surname, password, email, number } = req.body;

  if (!name || !surname || !password || !email || !number) {
    throw new BadRequestError(`Please fill in all the fields to register successfully.`);
  }

  const validEmail = isEmail(email);

  if (!validEmail) {
    throw new BadRequestError(`The email you entered is not valid.`);
  }

  const user = await Users.create({ name, surname, password, email, number });

  if (!user) {
    throw new BadRequestError(`Error in registering. Try again later.`);
  }

  const token = await user.createToken();

  const sendVerification = await sendEmail(`${user.name} ${user.surname}`, user.email, token);

  if (!sendVerification) {
    throw new BadRequestError(`Error in sending authentication please wait for a while.`);
  }

  res.status(StatusCodes.OK).json({ token, id: user._id, email: user.email });
};

const loginUser = async (req, res) => {
  const { candidate_email, candidate_password } = req.body;

  const user = await Users.findOne({ email: candidate_email });

  if (!user) {
    throw new NotFoundError(`No user found with the email ${candidate_email}.`);
  }

  const isMatch = await user.comparePassword(candidate_password, user.password);

  if (!isMatch) {
    throw new BadRequestError(`The email and password you entered does not match.`);
  }

  const token = await user.createToken();

  res.status(StatusCodes.OK).json({
    token,
    id: user._id,
    email: user.email,
    handler: user.isHandler,
    verified: user.isVerified,
  });
};

const verifyUser = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new UnauthenticadError(
      `Your authentication link is invalid. Please register in the correct manner.`
    );
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const { id, name, surname, email } = decode;

  if (!id || !name || !surname || !email) {
    throw new UnauthenticadError(
      `Your authentication link is invalid. Please register in the correct manner.`
    );
  }

  const user = await Users.findByIdAndUpdate(id, { isVerified: true });

  if (!user) {
    throw new NotFoundError(`Your authentication link does not exist.`);
  }

  res.status(StatusCodes.OK).json({ token, id, email });
};

module.exports = { loginUser, registerUser, verifyUser };
