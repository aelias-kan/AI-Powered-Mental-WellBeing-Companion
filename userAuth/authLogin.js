const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

const initializePassport = (passport) => {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        console.log("No user found with email:", email);
        return done(null, false, { message: "No user with that email" });
      }

      console.log("Found user:", user);

      if (await bcrypt.compare(password, user.password)) {
        console.log("Password match");
        return done(null, user);
      } else {
        console.log("Password mismatch");
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (err) {
      console.log("Error in authenticateUser:", err);
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

module.exports = initializePassport;
