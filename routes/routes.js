var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const authController = require("../controllers/authController");
const postController = require("../controllers/postController");

/* GET home page. */
router.get("/", postController.index);

// Get sign up form

router.get("/sign-up", authController.sign_up)

// Get log in form

router.get("/log-in", authController.log_in);

// Get log out

router.get("/log-out", authController.log_out)

// post sign up form

router.post("/sign-up", authController.sign_up_post);

// post log in form

router.post("/log-in", authController.log_in_post);


// POSTS routes.

// get post form
router.get("/new-post", postController.new_post);

// get post detail view
router.get("/:postId", postController.detail_post);

// post post form
router.post("/new-post", postController.new_post_post)







module.exports = router;
