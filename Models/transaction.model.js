const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["income", "expense", "transfer"], required: true },
    category: String,
    amount: Number,
    description: String,
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // for transfers
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
  }, { timestamps: true });
  
const transactionModel = mongoose.model("Transaction", transactionSchema);

module.exports = transactionModel
  