const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

//load User Model
require("../models/User");
const User = mongoose.model("users");

//Users
router.get("/", (req, res) => {
  User.find({})
    .sort({ date: "desc" })
    .then(users => {
      res.send(users);
    });
});

//Removing a Data
router.delete("/:id", (req, res) => {
  User.findByIdAndDelete({
    _id: req.params.id
  }).then(() => {
    res.send("Deleted");
  });
});

//Users Login
router.post("/login", (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/ideas',
        failureMessage: 'Unable to login'
    })(req,res,next);
});

//Users register
router.post(
  "/register",
  [
    // username must be an email
    check("email").isEmail(),
    // password must be at least 5 chars long
    check("password").isLength({ min: 5 })
  ],
  (req, res) => {
    console.log(req.body);
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          res.send({ error: "Duplicate Email" });
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  res.send({ response: "User created" });
                })
                .catch(err => {
                  console.log(err);
                });
            });
          });
        }
      });
    }
  }
);

module.exports = router;
