// Routes/goal.routes.js
const express = require("express");
const authMiddleware = require("../Middlewares/auth.middleware");
const goalModel = require("../Models/goal.model");

const goalRouter = express.Router();

// Create a goal
goalRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;
    const goal = new goalModel({
      user: req.user,
      title,
      targetAmount,
      deadline,
    });
    await goal.save();
    res.status(201).json({ message: "Goal created", goal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add progress (track saving towards goal)
goalRouter.post("/:id/add-progress", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    let goal = await goalModel.findById(req.params.id);

    if (!goal) return res.status(404).json({ error: "Goal not found" });
    if (goal.user.toString() !== req.user)
      return res.status(403).json({ error: "Not authorized" });

    goal.currentAmount += amount;

    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "achieved";
    }

    await goal.save();
    res.json({ message: "Progress updated", goal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all goals for a user
goalRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const goals = await goalModel.find({ user: req.user });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = goalRouter;
