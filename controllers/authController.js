const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");

exports.login = (req, res, next) => {
  console.log(req.body);
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

exports.signup = async (req, res) => {
  try {
    const { email, password, fullname, age, sex, userbrief } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      fullname,
      age,
      sex,
      user_brief: userbrief,
    });
    await user.save();
    res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.redirect("/signup");
  }
};

exports.logout = (req, res) => {
  delete req.session["selected_chat_id"];
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.redirect("/");
    }
    res.redirect("/");
  });
};
