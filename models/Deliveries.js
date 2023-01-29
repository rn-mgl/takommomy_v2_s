const mongoose = require("mongoose");

const DeliveriesSchema = mongoose.Schema(
  {
    orderedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "You need the buyer id to get the delivery information."],
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: [true, "You need the order id to get the delivery information."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", DeliveriesSchema);
