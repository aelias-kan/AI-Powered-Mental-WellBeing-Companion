const Journal = require("../models/Journals");

exports.createJournalEntry = async (req, res) => {
  try {
    const { journaltitle, journaldescription } = req.body;
    const createdBy = req.user._id;

    const newJournalEntry = new Journal({
      journaltitle,
      journaldescription,
      owner: createdBy,
    });

    await newJournalEntry.save();
    res.status(201).json({ message: "Journal entry created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create journal entry" });
  }
};

exports.getAllJournalEntries = async (req, res) => {
  try {
    const createdBy = req.user._id;
    const journalEntries = await Journal.find({ owner: createdBy });
    res.send(journalEntries);
  } catch (err) {
    console.error("Error occurred while fetching journal entries:", err);
    res.render("error", { error: err });
  }
};

exports.deleteJournalEntry = async (req, res) => {
  try {
    const journalEntryId = req.params.id;
    const deletedJournalEntry = await Journal.findByIdAndDelete(journalEntryId);
    if (!deletedJournalEntry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }
    res.json({ message: "Journal entry deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete journal entry" });
  }
};
