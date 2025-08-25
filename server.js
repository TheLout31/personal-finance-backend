const express = require("express");
const cors = require("cors");
const connectToDB = require("./Configs/mongodb.config");
const UserRouter = require("./Routes/user.routes");
const TransactionRouter = require("./Routes/transaction.routes");
const BudgetRouter = require("./Routes/budget.routes");
const goalRouter = require("./Routes/goal.routes");
const NotificationRouter = require("./Routes/notification.routes");

const app = express();


const PORT = 3000;
app.use(cors());
app.use(express.json());

connectToDB();

app.get("/", (req, res) => {
  res.json("Request working successfully!!!");
});

app.use("/user", UserRouter);
app.use("/transaction", TransactionRouter);
app.use("/budget", BudgetRouter);
app.use("/goal", goalRouter);
app.use("/notification",NotificationRouter)



// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

module.exports = app


