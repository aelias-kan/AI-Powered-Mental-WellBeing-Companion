var express = require("express");
var router = express.Router();
const reminderController = require("../controllers/reminderController");
const journalController = require("../controllers/journalController");

router.get(
  "/reminders",
  reminderController.getAllReminders,
  function (req, res, next) {
    res.render("index");
  }
);

router.post(
  "/new",
  reminderController.createReminder,
  function (req, res, next) {
    res.render("index");
  }
);

router.get(
  "/journals",
  journalController.getAllJournalEntries,
  function (req, res, next) {
    res.render("index");
  }
);

router.post(
  "/newjournal",
  journalController.createJournalEntry,
  function (req, res, next) {
    res.render("index");
  }
);

router.delete("/reminders/:id", reminderController.deleteReminder);
router.delete("/journals/:id", journalController.deleteJournalEntry);

module.exports = router;
