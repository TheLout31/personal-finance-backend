const express = require("express");
const authMiddleware = require("../Middlewares/auth.middleware");
const notificationModel = require("../Models/notification.model");

const NotificationRouter = express.Router();

// Get all notifications
NotificationRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const notifications = await notificationModel
      .find({ user: userId })
      .sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: err.message });
  }
});

// Mark as read
NotificationRouter.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await notificationModel.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating notification", error: err.message });
  }
});

// Delete notification
NotificationRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const notification = await notificationModel.findByIdAndDelete(
      req.params.id
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting notification", error: err.message });
  }
});

module.exports = NotificationRouter;
