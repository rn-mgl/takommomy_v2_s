const { Messages } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const getAllMessages = async (req, res) => {
  const { id } = req.user;

  const messages = await Messages.aggregate([
    {
      $match: {
        $or: [{ sender: mongoose.Types.ObjectId(id) }, { receiver: mongoose.Types.ObjectId(id) }], // from string to mongodb objectID
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiverName",
        pipeline: [{ $project: { password: 0, email: 0, number: 0 } }],
      },
    },
    { $unwind: "$receiverName" },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "senderName",
        pipeline: [{ $project: { password: 0, email: 0, number: 0 } }],
      },
    },
    { $unwind: "$senderName" },
    { $sort: { createdAt: -1 } },
  ]);

  if (!messages) {
    throw new NotFoundError(`No messages found.`);
  }

  res.status(StatusCodes.OK).json(messages);
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

const sendMessage = async (req, res) => {
  const { id: sender } = req.user; // sender
  const { receiver, message, file, type } = req.body.messageData; // receiver

  if (type === "c") {
    // client
    const newMessage = await Messages.create({
      sender,
      receiver: process.env.SEND_TO,
      message,
      file,
      roomCode: process.env.SEND_TO,
    });

    if (!newMessage) {
      throw new BadRequestError(`Error in sending message. Try again later.`);
    }

    res.status(StatusCodes.OK).json(newMessage);

    return;
  } else if (type === "a") {
    //admin
    const newMessage = await Messages.create({
      sender,
      receiver,
      message,
      file,
      roomCode: receiver,
    });

    if (!newMessage) {
      throw new BadRequestError(`Error in sending message. Try again later.`);
    }

    res.status(StatusCodes.OK).json(newMessage);

    return;
  } else {
    throw new BadRequestError(`This message form is not applicable.`);
  }
};

module.exports = { sendMessage, getAllMessages, getMessages };
