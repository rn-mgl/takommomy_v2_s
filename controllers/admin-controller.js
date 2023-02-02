const { Messages, Orders, Users } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const getAllOrders = async (req, res) => {
  const { filter } = req.query;

  let statusArr = [""];

  switch (filter) {
    case "Requests":
      statusArr = ["Requesting", "Requesting Cancellation", "Cancellation Rejected"];
      break;

    case "Prepare":
      statusArr = ["Preparing", "Slight Delay"];
      break;

    case "Delivery":
      statusArr = ["On Delivery", "Delivery Failed"];
      break;

    case "Cancel":
      statusArr = [
        "Requesting Cancellation",
        "Cancelled",
        "Cancellation Confirmed",
        "Order Denied",
      ];
      break;

    case "Successful":
      statusArr = ["Successful"];
      break;

    case "All":
      statusArr = [
        "Requesting",
        "Requesting Cancellation",
        "Preparing",
        "On Delivery",
        "Cancelled",
        "Successful",
      ];
      break;

    default:
      statusArr;
      break;
  }

  const orders = await Orders.aggregate([
    {
      $match: { status: { $in: statusArr } },
    },
    {
      $lookup: {
        from: "users",
        localField: "orderedBy",
        foreignField: "_id",
        as: "buyerData",
        pipeline: [{ $project: { password: 0 } }],
      },
    },
    { $unwind: "$buyerData" },
    { $sort: { createdAt: -1 } },
  ]);

  if (!orders) {
    throw new BadRequestError(`Error in getting all orders. Try again later.`);
  }

  res.status(StatusCodes.OK).json(orders);
};

const getOrder = async (req, res) => {
  const { order_id } = req.params;

  const order = await Orders.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(order_id) } },
    {
      $lookup: {
        from: "users",
        localField: "orderedBy",
        foreignField: "_id",
        as: "buyerData",
        pipeline: [{ $project: { password: 0 } }],
      },
    },
    { $unwind: "$buyerData" },
  ]);

  if (!order) {
    throw new BadRequestError(`Error in getting order.`);
  }

  res.status(StatusCodes.OK).json(order[0]);
};

const orderResponse = async (req, res) => {
  const { order_id } = req.params;

  let { status } = req.body;
  let statusMessage = "";

  switch (status) {
    case "Prepare":
      status = "Preparing";
      statusMessage = "Seller is preparing your order. Please wait for further responses.";
      break;
    case "Confirm Cancellation":
      status = "Cancellation Confirmed";
      statusMessage = "Seller has cancelled your order.";
      break;
    case "Deliver":
      status = "On Delivery";
      statusMessage = "Your order is on the way to you. We hope you receive it!";
      break;
    case "Successful":
      statusMessage = "Your order has been delivered. Have fun!";
      break;
    case "Deny":
      status = "Order Denied";
      statusMessage = "Seller has denied your order.";
      break;
    case "Reject Cancellation":
      status = "Cancellation Rejected";
      statusMessage = "Seller has rejected your cancellation. Your order will be processed.";
      break;
    case "Delay":
      status = "Slight Delay";
      statusMessage = "We apologize, there is a slight delay in your order.";
      break;
    case "Delivery Failed":
      statusMessage = "We are sorry, but the delivery has failed. Please message us for help.";
      break;
    case "Cancel":
      status = "Cancellation Confirmed";
      statusMessage = "We are sorry, but the delivery has failed. Please message us for help.";
      break;
    default:
      statusMessage;
      break;
  }

  const order = await Orders.findByIdAndUpdate(order_id, { status, statusMessage });

  if (!order) {
    throw new BadRequestError(`Error in responding to order. Try again later.`);
  }

  res.status(StatusCodes.OK).json(order);
};

const getAllUsers = async (req, res) => {
  const { id } = req.user;

  const user = await Users.find({ _id: { $ne: id } });

  if (!user) {
    throw new NotFoundError(`No user found with the id ${id}.`);
  }

  res.status(StatusCodes.OK).json(user);
};

const getUser = async (req, res) => {
  const { user_id } = req.params;

  const user = await Users.findById(user_id);

  if (!user) {
    throw new NotFoundError(`No user found with the id ${id}.`);
  }

  res.status(StatusCodes.OK).json(user);
};

const updateReputation = async (req, res) => {
  const { user_id } = req.params;
  const { reputation } = req.body;

  const user = await Users.findByIdAndUpdate(user_id, { reputation });

  if (!user) {
    throw new NotFoundError(`No user found with the id ${id}.`);
  }

  res.status(StatusCodes.OK).json(user);
};

const cancellationResponse = async (req, res) => {
  const { order_id } = req.params;

  const order = await Orders.findByIdAndDelete(order_id);

  if (!order) {
    throw new BadRequestError(`Error in cancelling order. Try again later.`);
  }

  res.status(StatusCodes.OK).json(order);
};

const getAllMessages = async (req, res) => {
  const { user_id } = req.params;
  const { id } = req.user; //admin

  const messages = await Messages.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              { sender: mongoose.Types.ObjectId(id) },
              { receiver: mongoose.Types.ObjectId(id) },
            ],
          },
          {
            $or: [
              { sender: mongoose.Types.ObjectId(user_id) },
              { receiver: mongoose.Types.ObjectId(user_id) },
            ],
          },
        ], // from string to mongodb objectID
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

module.exports = {
  orderResponse,
  cancellationResponse,
  getAllOrders,
  getOrder,
  getAllUsers,
  getUser,
  updateReputation,
  getAllMessages,
};
