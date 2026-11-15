const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { checkNotAuthenticated } = require("../middlewares/auth");

router.get("/", checkNotAuthenticated, (req, res) => {
  res.render("signup");
});

router.post("/", checkNotAuthenticated, authController.signup);

module.exports = router;
