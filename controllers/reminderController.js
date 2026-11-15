const Reminder = require("../models/Reminders");

exports.createReminder = async (req, res) => {
  try {
    const {
      remindertitle,
      remindertype,
      reminderpriority,
      deadline,
      reminderdescription,
    } = req.body;

    console.log(req.body);
    createdby = req.user._id;
    console.log(createdby);

    const newReminder = new Reminder({
      remindertitle,
      remindertype,
      reminderpriority,
      deadline,
      reminderdescription,
      owner: createdby,
    });

    console.log("saving", newReminder);

    await newReminder.save();
    res.status(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create reminder" });
  }
};

exports.getAllReminders = async (req, res) => {
  try {
    const createdBy = req.user._id;
    const reminders = await Reminder.find({ owner: createdBy });
    res.send(reminders);
  } catch (err) {
    console.error("Error occurred while fetching reminders:", err);
    res.render("error", { error: err });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const reminderId = req.params.id;
    const deletedReminder = await Reminder.findByIdAndDelete(reminderId);
    if (!deletedReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    res.json({ message: "Reminder deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete reminder" });
  }
};
