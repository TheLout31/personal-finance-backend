const notificationModel = require("../Models/notification.model");


const sendNotification = async (userId, title, message, type = "general") => {
  try {
    const newNotification = new notificationModel({
      user: userId,
      title,
      message,
      type
    });
    await newNotification.save();
    return newNotification;
  } catch (err) {
    console.error("Error creating notification:", err.message);
  }
};

module.exports = sendNotification;
