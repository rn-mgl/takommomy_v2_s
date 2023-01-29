const { Messages, Orders } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllOrders = async (req, res) => {
  const orders = await Orders.find({
    $or: [{ status: "Cancelled" }, { status: "Buyer Cancellation Request" }],
  });

  if (!orders) {
    throw new BadRequestError(`Error in getting all orders. Try again later.`);
  }

  res.status(StatusCodes.OK).json(orders);
};

const orderResponse = async (req, res) => {
  const { status, statusMessage } = req.body;
  const { order_id } = req.params;

  const order = await Orders.findByIdAndUpdate(order_id, { status, statusMessage });

  if (!order) {
    throw new BadRequestError(`Error in responding to order. Try again later.`);
  }

  res.status(StatusCodes.OK).json(order);
};

const cancellationResponse = async (req, res) => {
  const { order_id } = req.params;

  const order = await Orders.findByIdAndDelete(order_id);

  if (!order) {
    throw new BadRequestError(`Error in cancelling order. Try again later.`);
  }

  res.status(StatusCodes.OK).json(order);
};

module.exports = {
  orderResponse,
  cancellationResponse,
  getAllOrders,
};
