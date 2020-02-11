const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load User model.
const User  = mongoose.model('users');

//module.exports =  function passport