const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

//Home - get all posts


// get log in
exports.log_in = asyncHandler(async (req, res, next) => {
    res.render("log-in-form", { user: req.user })
});

//get log out
exports.log_out = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  })

//post log in 
exports.log_in_post = asyncHandler(async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err); // Forward to the error handler
      }
  
      if (!user) {
        // Authentication failed
        return res.render('log-in-form', { errorMessage: info.message, user: req.user });
      }
  
      // Authentication succeeded
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
  
        return res.redirect('/');
      });
    })(req, res, next);
  });

//get sign up
exports.sign_up = asyncHandler( async (req, res) => {
    if (req.user) {
        res.redirect('/');
        return;
    }
    res.render("sign-up-form", {user: req.user})
});

//post sign up
exports.sign_up_post = asyncHandler( async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      try {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        const result = await user.save();
        res.redirect("/");
      } catch (err) {
        return next(err);
      }
    });
  });