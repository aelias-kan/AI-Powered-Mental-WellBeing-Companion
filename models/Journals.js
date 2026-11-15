const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  journaltitle: { type: String, required: true },
  journaldescription: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Journal = mongoose.model("Journal", journalSchema);

module.exports = Journal;
