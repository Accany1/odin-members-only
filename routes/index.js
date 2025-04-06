const passport = require('passport');
const {Router} = require('express')
const app = Router()
const usersController = require("../controllers/userController");
const { body } = require("express-validator");
const {checkUserExist} = require("../db/queries");

app.get("/", usersController.usersListGet);

app.get("/new", (req, res) => {
    res.render("form", {user: req.user});
});

app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
      if (err) {
      return next(err);
      }
      res.redirect("/");
  });
  });

app.get("/signup", (req, res) => {
  res.render("signup", {errors: []});
});

app.post("/new", (req, res) => usersController.newPost(req,res,req.user));

app.post("/signup", 
  body("first")
      .trim()
      .isAlpha()
      .withMessage("First name must only contain letters."),
  body("last")
      .trim()
      .isAlpha()
      .withMessage("Last name must only contain letters."),
  body('username')
      .trim()
      .notEmpty().withMessage('Username is required.')
      .custom(async (username, {req}) => {
          const exists = await checkUserExist(username);
          if (exists) {
              throw new Error('Username already exists.');
          }
      }),
  body('passwordConfirmation')
      .custom((value, { req }) => {if (value !== req.body.password) {
          throw new Error('Passwords must match.'); // Throw error within custom validator
      } return true;}),
      (req, res, next) => usersController.newUser(req,res))

app.get("/:id/delete", (req, res) => {
    usersController.deletePost(req.params.id)
    res.redirect("/")
})

module.exports = app;