const mongoose = require("mongoose");

const OrdersSchema = mongoose.Schema(
  {
    variety: {
      type: String,
      required: [true, "You forgot to add the variety of your order."],
      enum: {
        values: ["HAM & CHEESE", "SPAM & CHEESE", "CRAB & CORN", "OCTOBITS"],
        message: "{VALUE} is not on our menu.",
      },
    },
    quantity: {
      type: Number,
      required: [true, "You forgot to add the quantity of your order."],
    },
    price: {
      type: Number,
      required: [true, "You forgot to add the price of your order."],
    },
    paymentType: {
      type: String,
      required: [true, "You forgot to add the payment type for your order."],
      enum: {
        values: ["GCash", "Cash on Delivery"],
        message: "{VALUE} is not a supported payment method.",
      },
    },
    receivingType: {
      type: String,
      required: [true, "You forgot to add the receiving type for your order."],
      enum: {
        values: ["Pick Up", "Delivery"],
        message: "{VALUE} is not a supported receiving method.",
      },
    },
    receiverName: {
      type: String,
      default: null,
    },
    deliveryDate: {
      type: String,
      required: [true, "Please include the date of your delivery."],
    },
    deliveryTime: {
      type: String,
      required: [true, "Please include the time of your delivery."],
    },
    orderedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please log in before ordering."],
    },
    deliveryAddress: {
      type: String,
      required: [true, "Please enter an address so we can deliver your food."],
      default: "No address needed. The order is for pick up.",
    },
    status: {
      type: String,
      default: "Requesting",
    },
    statusMessage: {
      type: String,
      default:
        "Waiting for seller to accept the order. You can also message the facebook page for follow ups.",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrdersSchema);
