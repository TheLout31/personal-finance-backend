// Models/goal.model.js
const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true }, // e.g. "Save for Laptop"
    targetAmount: { type: Number, required: true }, // total saving goal
    currentAmount: { type: Number, default: 0 }, // how much saved so far
    deadline: { type: Date }, // optional, like 2025-12-31
    status: {
      type: String,
      enum: ["in-progress", "achieved", "failed"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

const goalModel = mongoose.model("Goal", goalSchema);

module.exports = goalModel;
