const express = require("express");
const authMiddleware = require("../Middlewares/auth.middleware");
const budgetModel = require("../Models/budget.model");

const BudgetRouter = express.Router();

// 🔹 Create Budget
BudgetRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    const { period, category, amount } = req.body;
    const userId = req.user;

    let startDate = new Date();
    let endDate = new Date();

    if (period === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (period === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const newBudget = new budgetModel({
      user: userId,
      period,
      category: category || "All",
      amount,
      spent: 0,
      startDate,
      endDate,
    });

    await newBudget.save();

    res
      .status(201)
      .json({ message: "Budget created successfully", budget: newBudget });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating budget", error: err.message });
  }
});

// 🔹 Get All Budgets for User
BudgetRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const budgets = await budgetModel.find({ user: userId });
    res.status(200).json({ budgets });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching budgets", error: err.message });
  }
});

// 🔹 Check Budget Status (progress)
BudgetRouter.get("/progress/:budgetId", authMiddleware, async (req, res) => {
  try {
    const budget = await budgetModel.findById(req.params.budgetId);
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    const percentage = ((budget.spent / budget.amount) * 100).toFixed(2);

    res.status(200).json({
      budget,
      percentage,
      remaining: budget.amount - budget.spent,
      status: percentage >= 100 ? "Exceeded" : "Within limit",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching budget progress", error: err.message });
  }
});


BudgetRouter.delete("/delete/:budgetId", authMiddleware, async (req, res) => {
  const userId = req.user; // set by authMiddleware
  const { budgetId } = req.params;

  try {
    // 🔍 Find the budget
    const budget = await budgetModel.findOne({ _id: budgetId, user: userId });
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // 🗑️ Delete it
    await budgetModel.findByIdAndDelete(budgetId);

    return res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Delete Budget Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = BudgetRouter;
