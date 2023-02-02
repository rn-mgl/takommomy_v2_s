const Users = require("../models/Users");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getUser = async (req, res) => {
  const { id } = req.user;

  const user = await Users.findById(id);

  if (!user) {
    throw new NotFoundError(`No user found with the id ${id}.`);
  }

  res.status(StatusCodes.OK).json(user);
};

const updateUser = async (req, res) => {
  const { name, surname, oldPassword, newPassword, number, updateType } = req.body;
  const { id } = req.user;

  if (updateType === "name") {
    const user = await Users.findByIdAndUpdate(id, { name });

    if (!user) {
      throw new NotFoundError(`No user found with the id ${id}.`);
    }

    res.status(StatusCodes.OK).json(user);

    return;
  } else if (updateType === "surname") {
    const user = await Users.findByIdAndUpdate(id, { surname });

    if (!user) {
      throw new NotFoundError(`No user found with the id ${id}.`);
    }

    res.status(StatusCodes.OK).json(user);

    return;
  } else if (updateType === "password") {
    const isMatch = await user.comparePassword(oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestError(
        `The old password you entered does not match with your current password.`
      );
    }

    const user = await Users.findByIdAndUpdate(id, { newPassword });

    if (!user) {
      throw new NotFoundError(`No user found with the id ${id}.`);
    }

    res.status(StatusCodes.OK).json(user);

    return;
  } else if (updateType === "number") {
    const user = await Users.findByIdAndUpdate(id, { number });

    if (!user) {
      throw new NotFoundError(`No user found with the id ${id}.`);
    }

    res.status(StatusCodes.OK).json(user);

    return;
  } else {
    throw new BadRequestError(`This type of update is not valid.`);
  }
};

module.exports = { getUser, updateUser };
