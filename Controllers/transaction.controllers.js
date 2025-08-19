const budgetModel = require("../Models/budget.model");
const transactionModel = require("../Models/transaction.model");
const userModel = require("../Models/user.model");

exports.postTransactions = async (req, res) => {
  try {
    const { type, category, amount, description, toUser } = req.body;
    const userId = req.user; // since authMiddleware attaches user info

    let user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let toUserData;
    if (type === "transfer") {
      if (!toUser)
        return res
          .status(400)
          .json({ message: "toUser is required for transfers" });
      toUserData = await userModel.findById(toUser);
      if (!toUserData)
        return res.status(404).json({ message: "Recipient user not found" });

      // check sender balance
      if (user.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      user.balance -= amount;
      toUserData.balance += amount;
      await toUserData.save();
    } else if (type === "income") {
      user.balance += amount;
    } else if (type === "expense") {
      if (user.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const activeBudgets = await budgetModel.find({
        user: userId,
        category: { $in: ["All", category] },
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });
      console.log("List of active budgets", activeBudgets);
      for (let b of activeBudgets) {
        if (b.spent >= b.amount) {
          // create notification for user
          console.log(`⚠️ Budget exceeded for ${b.category}`);
        } else if (b.spent >= b.amount * 0.8) {
          console.log(`⚠️ Budget nearing limit for ${b.category}`);
        }
        b.spent += amount;
        await b.save();
      }

      user.balance -= amount;
    } else {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Save updated user balance
    await user.save();

    // Create transaction
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
