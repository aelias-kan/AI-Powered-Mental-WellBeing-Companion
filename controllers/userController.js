const User = require("../models/User");

exports.getUserProfile = (req, res, next) => {
  res.render("index", {
    name: req.user.fullname,
    email: req.user.email,
    age: req.user.age,
    sex: req.user.sex,
  });
  next();
};

exports.getUserInfo = (req, res, next) => {
  res.locals.userInfo = {
    name: req.user.fullname,
    age: req.user.age,
    sex: req.user.sex,
    user_brief: req.user?.user_brief || "",
  };

  next();
};
