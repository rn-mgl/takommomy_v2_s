const mongoose = require("mongoose");

const MessagesSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please log in before sending messages."],
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please log in before sending messages."],
    },
    message: {
      type: String,
      default: null,
    },
    file: {
      type: String,
      default: null,
    },
    roomCode: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Enter room before sending messages."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessagesSchema);
