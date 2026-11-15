const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { checkNotAuthenticated } = require("../middlewares/auth");

router.get("/", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

router.post("/", checkNotAuthenticated, authController.login);

module.exports = router;
