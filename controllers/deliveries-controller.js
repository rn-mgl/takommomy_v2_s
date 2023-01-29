const { Orders, Users } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const updateDelivery = async (req, res) => {
  const { order_id } = req.params;

  const delivery = await Orders.findByIdAndUpdate(order_id, {
    status: "On Delivery",
    statusMessage: "Your order is going to be delivered.",
  });

  if (!delivery) {
    throw new BadRequestError(`Error in updating delivery. Try again later.`);
  }

  res.status(StatusCodes.OK).json(delivery);
};

const getDelivery = async (req, res) => {
  const { order_id } = req.params;
  const delivery = await Orders.findById(order_id);

  if (!delivery) {
    throw new NotFoundError(`No delivery found with the id ${order_id}.`);
  }

  const user = await Users.findById(delivery?.orderedBy);

  if (!user) {
    throw new NotFoundError(`No user found with the id ${delivery?.orderedBy}.`);
  }

  res.status(StatusCodes.OK).json({ delivery, user });
};

const getAllDelivery = async (req, res) => {
  const deliveries = await Orders.find({ status: "On Delivery" });

  if (!deliveries) {
    throw new BadRequestError(`Error in getting all deliveries. Try again later.`);
  }

  const users = await Users.find({ _id: { $in: deliveries.orderedBy } });

  if (!users) {
    throw new BadRequestError(`Error in getting all orders. Try again later.`);
  }

  res.status(StatusCodes.OK).json({ deliveries, users });
};

const removeDelivery = async (req, res) => {
  const { order_id } = req.params;

  const delivery = await Orders.findByIdAndDelete(order_id);

  if (!delivery) {
    throw new BadRequestError(`Error in removing delivery. Try again later.`);
  }

  res.status(StatusCodes.OK).json(delivery);
};

module.exports = { getDelivery, getAllDelivery, updateDelivery, removeDelivery };
