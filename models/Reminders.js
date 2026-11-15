const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  remindertitle: { type: String, required: true },
  remindertype: { type: String, required: true },
  reminderpriority: { type: String, required: true },
  deadline: { type: Date, required: true },
  reminderdescription: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
