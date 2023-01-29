const mongoose = require("mongoose");

const IncomeSchema = mongoose.Schema(
  {
    thisDay: {
      type: Number,
      required: [true, "Enter a number before updating."],
      default: 0,
    },
    thisWeek: {
      type: Number,
      required: [true, "Enter a number before updating."],
      default: 0,
    },
    thisMonth: {
      type: Number,
      required: [true, "Enter a number before updating."],
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", IncomeSchema);
