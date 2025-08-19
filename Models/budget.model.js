const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  period: { type: String, enum: ["monthly", "yearly"], required: true },
  category: { type: String, default: "All" }, // "All" = general budget
  amount: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now }, 
  endDate: { type: Date } // you can set based on monthly/yearly
}, { timestamps: true });

const budgetModel = mongoose.model("Budget", budgetSchema);

module.exports = budgetModel
