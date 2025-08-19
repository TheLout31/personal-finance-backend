const express = require("express");
const authMiddleware = require("../Middlewares/auth.middleware");
const {
  postTransactions,
  getTransactions,
} = require("../Controllers/transaction.controllers");

const TransactionRouter = express.Router();

// 🔹 Add Transaction
TransactionRouter.post("/add-transaction", authMiddleware, postTransactions);

// 🔹 Get Transactions (with filters)
TransactionRouter.get("/get-transactions", authMiddleware, getTransactions);

module.exports = TransactionRouter;
