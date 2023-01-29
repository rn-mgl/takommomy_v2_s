const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UsersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You forgot to enter your name. It is a required field."],
    },
    surname: {
      type: String,
      required: [true, "You forgot to enter your surname. It is a required field."],
    },
    password: {
      type: String,
      required: [true, "You forgot to enter your password. It is a required field."],
      minLength: 8,
    },
    email: {
      type: String,
      required: [true, "You forgot to enter your email. It is a required field."],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email.",
      ],
    },
    number: {
      type: String,
      required: [true, "You forgot to enter your phone number. It is a required field."],
    },
    reputation: {
      type: Number,
      default: 100,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isHandler: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UsersSchema.pre("updateOne", async function () {
  let data = this.getUpdate();
  const salt = await bcrypt.genSalt(20);
  data.password = await bcrypt.hash(data.password, salt);
});

UsersSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UsersSchema.methods.createToken = async function () {
  const token = jwt.sign(
    { id: this._id, name: this.name, surname: this.surname, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_TTL }
  );
  return token;
};

UsersSchema.methods.comparePassword = async function (candidatePassword, dbPassword) {
  const isMatch = await bcrypt.compare(candidatePassword, dbPassword);
  return isMatch;
};

module.exports = mongoose.model("User", UsersSchema);
