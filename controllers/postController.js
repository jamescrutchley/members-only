const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");


// home - get all posts and pass in user object
exports.index = asyncHandler(async (req, res, next) => {
    try {
        const posts = await Post.find({}).populate("author").sort({title: 1}).exec();
        res.render("home", { user: req.user, posts: posts })
      } catch (err) {
        next(err);
      }
});


// get new form page
exports.new_post = asyncHandler(async (req, res, next) => {
    res.render("new-post", {user: req.user})
})

// get detail post page
exports.detail_post = asyncHandler(async (req, res, next) => {
    console.log(req.params)
    const post = await Post.findById(req.params.postId).populate("author").exec();

    if (post === null) {
      // No results.
      const err = new Error("Post not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("detail-post", {post: post, user: req.user})
})


// post new form
exports.new_post_post = [
    body("title", "Title must not be empty.")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("copy", "Field must not be empty.")
      .trim()
      .isLength({ min: 1, max: 200})
      .escape(),

      asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const post = new Post({
            title: req.body.title ? req.body.title : "Untitled Post",
            copy: req.body.copy,
            author: req.user,
        });

        if (!errors.isEmpty()) {
            console.log(errors)
            res.render("new-post", { user: req.user, errors: errors.array() });

        } else {
            await post.save();
            res.redirect('/');
        }
      })
]

