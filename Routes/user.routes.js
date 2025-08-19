const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
const jwt = require("jsonwebtoken");
const userModel = require("../Models/user.model");
const { signUp, logIn } = require("../Controllers/auth.controllers");
const UserRouter = express.Router();

UserRouter.post("/signup", signUp);

UserRouter.post("/login", logIn);

module.exports = UserRouter
