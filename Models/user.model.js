const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  // 🔹 Finance-related fields
  balance: { type: Number, default: 0 },  // starting balance
  categories: {                           // default + custom categories
    type: [String],
    default: ["Salary", "Groceries", "Bills", "Food", "Entertainment", "Misc"]
  }
}, { timestamps: true });


const userModel = mongoose.model("User", userSchema);

module.exports = userModel