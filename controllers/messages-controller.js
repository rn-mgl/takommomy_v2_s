const { Messages, Users } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllMessages = async (req, res) => {
  const { id } = req.user;

  const messages = await Messages.distinct("receiver", { receiver: { $ne: id } });

  if (!messages) {
    throw new NotFoundError(`No messages found.`);
  }

  const users = await Users.find({ _id: { $in: messages.receiver } });

  res.status(StatusCodes.OK).json(users);
};

const getMessages = async (req, res) => {
  const { userId } = req.query;
  const { message_id } = req.params;

  const message = await Messages.find({ receiver: userId });

  if (!message) {
    throw new NotFoundError(`No messages found for the receiver ${message_id}.`);
  }

  res.status(StatusCodes.OK).json(message);
};

const sendMessage = async (req, res) => {};

module.exports = { sendMessage, getAllMessages, getMessages };
