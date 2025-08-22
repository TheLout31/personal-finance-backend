const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
const jwt = require("jsonwebtoken");
const userModel = require("../Models/user.model");
const { signUp, logIn } = require("../Controllers/auth.controllers");
const authMiddleware = require("../Middlewares/auth.middleware");
const UserRouter = express.Router();

UserRouter.post("/signup", signUp);

UserRouter.post("/login", logIn);

UserRouter.get("/", authMiddleware, async (req, res) => {
  const userId = req.user;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Try signing up." });
    } else {
      res.status(200).json({ message: "User Data", user });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

UserRouter.get("/friends", authMiddleware, async (req, res) => {
  const userId = req.user;
  try {
    const friendsList = await userModel.find({ _id: { $ne: userId } }); 
    res.status(200).json({ message: "Friends List", friendsList });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

module.exports = UserRouter;
