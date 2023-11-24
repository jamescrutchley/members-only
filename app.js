require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("./models/User");

const router = require("./routes/routes");

const mongoDb = process.env.MONGODB_URI || process.env.DEV_URI;

mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: `We couldn't find user '${username}' in our database.` });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: `Incorrect password, ${username}'s password is ${user.password}` });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//simplify access to current user in views.

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", router);

app.listen(3000, () => console.log("app listening on port 3000!"));
