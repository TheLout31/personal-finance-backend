const budgetModel = require("../Models/budget.model");
const transactionModel = require("../Models/transaction.model");
const userModel = require("../Models/user.model");
// const { io, onlineUsers } = require("../server");

exports.postTransactions = async (req, res) => {
  try {
    const { type, category, amount, description, toUser } = req.body;
    const userId = req.user;

    let user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (type === "expense") {
      // 🔹 Update budgets
      const activeBudgets = await budgetModel.find({
        user: userId,
        category: { $in: ["All", category] },
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });

      for (let b of activeBudgets) {
        b.spent += amount;
        await b.save();
      }

      // 🔹 Deduct from balance
      user.balance -= amount;
    }

    if (type === "income") {
      user.balance += amount;
    }

    if (type === "transfer") {
      // 🔹 Deduct from sender
      user.balance -= amount;

      // 🔹 Add to receiver
      let receiver = await userModel.findById(toUser);
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
      }
      receiver.balance += amount;
      await receiver.save();
    }

    // 🔹 Save sender balance
    await user.save();

    // 🔹 Create transaction record
    const newTransaction = new transactionModel({
      user: userId,
      type,
      category,
      amount,
      description,
      toUser: toUser || null,
      status: "completed",
    });

    await newTransaction.save();

    res.status(201).json({
      message: "Transaction added successfully",
      transaction: newTransaction,
      balance: user.balance,
    });
  } catch (err) {
    console.error("Transaction error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user;
    const { type, category, from, to } = req.query;

    let filter = { user: userId };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (from && to) {
      filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    }

    const transactions = await transactionModel
      .find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
