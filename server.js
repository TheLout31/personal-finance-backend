const express = require("express");
const connectToDB = require("./Configs/mongodb.config");
const UserRouter = require("./Routes/user.routes");
const TransactionRouter = require("./Routes/transaction.routes");
const app = express();

const PORT = 3000;

app.use(express.json());

connectToDB()


app.get("/test", (req, res) => {
    res.json("Request working successfully!!!");
  });


app.use("/user", UserRouter)
app.use("/transaction", TransactionRouter)

  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });