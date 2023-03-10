const Orders = require("../models/Orders");
const { BadRequestError, UnauthenticatedError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createOrder = async (req, res) => {
  const { id } = req.user;
  const { orderData } = req.body;
  orderData.orderedBy = id;

  const order = await Orders.create(orderData);

  if (!order) {
    throw new BadRequestError(`Error in creating order. Try again later.`);
  }

  res.status(StatusCodes.OK).json(order);
};

const getAllOrders = async (req, res) => {
  const { id } = req.user;
  const { type } = req.query;

  if (type === "p") {
    const orders = await Orders.find({
      orderedBy: id,
      status: { $nin: ["On Delivery", "Delivery Failed", "Successful"] },
    });

    if (!orders) {
      throw new BadRequestError(`Error in getting orders. Try again later.`);
    }

    res.status(StatusCodes.OK).json(orders);
    return;
  } else if (type === "d") {
    const orders = await Orders.find({
      orderedBy: id,
      status: { $in: ["On Delivery", "Delivery Failed", "Successful"] },
    });

    if (!orders) {
      throw new BadRequestError(`Error in getting orders. Try again later.`);
    }

    res.status(StatusCodes.OK).json(orders);
    return;
  } else {
    throw new BadRequestError(`Error in getting orders. Try again later.`);
  }
};

const getOrder = async (req, res) => {
  const { order_id } = req.params;

  const order = await Orders.findById(order_id);

  if (!order) {
    throw new BadRequestError(`Error in getting order. Try again later.`);
  }

  res.status(StatusCodes.OK).json(order);
};

const cancelOrder = async (req, res) => {
  const { reason } = req.body;
  const { order_id } = req.params;

  const order = await Orders.findByIdAndUpdate(order_id, {
    status: "Requesting Cancellation",
    statusMessage: `Reason: ${reason}`,
  });

  if (!order) {
    throw new BadRequestError(`Error in cancelling order. Try again later.`);
  }

  res.status(StatusCodes.OK).json(order);
};

module.exports = { createOrder, getAllOrders, getOrder, cancelOrder };
