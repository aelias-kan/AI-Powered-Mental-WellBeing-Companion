const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  password: { type: String, required: true },
  user_brief: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
