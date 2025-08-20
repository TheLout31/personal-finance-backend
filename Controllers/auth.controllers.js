const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
const jwt = require("jsonwebtoken");
const userModel = require("../Models/user.model");

exports.signUp = async (req, res) => {
  const { name, email, password, balance, categories } = req.body;
  try {
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(500).json({ message: "Something went wrong" });
      } else {
        console.log("converted", password, "to this ===>", hash);
        await userModel.create({
          name,
          email,
          password: hash,
          balance,
          categories,
        });
        res.status(201).json({ message: "SigUp Successfull" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Try signing up." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      var token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
      console.log("Your token ===>", token);
      res.status(200).json({ message: "Successfully Logged In", user, token });
    } else {
      res.status(401).json({ message: "Wrong Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
