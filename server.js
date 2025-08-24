const express = require("express");
const { createServer } = require("node:http");
const cors = require("cors");
const connectToDB = require("./Configs/mongodb.config");
const UserRouter = require("./Routes/user.routes");
const TransactionRouter = require("./Routes/transaction.routes");
const BudgetRouter = require("./Routes/budget.routes");
const goalRouter = require("./Routes/goal.routes");
const { Server } = require("socket.io");
const NotificationRouter = require("./Routes/notification.routes");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const PORT = 3000;
app.use(cors());
app.use(express.json());

connectToDB();

app.get("/test", (req, res) => {
  res.json("Request working successfully!!!");
});

app.use("/user", UserRouter);
app.use("/transaction", TransactionRouter);
app.use("/budget", BudgetRouter);
app.use("/goal", goalRouter);
app.use("/notification",NotificationRouter)

// store connected users
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // when a user logs in, register their socket
  socket.on("registerUser", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("Registered:", onlineUsers);
  });

  socket.on("disconnect", () => {
    for (let uid in onlineUsers) {
      if (onlineUsers[uid] === socket.id) {
        delete onlineUsers[uid];
        break;
      }
    }
    console.log("❌ User disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { server, io, onlineUsers };
