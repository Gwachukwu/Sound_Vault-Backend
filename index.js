const express = require("express");
require("dotenv").config();

const connectDB = require("./models/dbconnection");
//const transactionRoutes = require("./routes/transactions");
const userRoutes = require("./routes/users");
const audioRoutes = require("./routes/audios");
//const authRoutes = require("./routes/auth");
//const accessRoutes = require("./routes/accessTransactions");
const cors = require("cors");

const app = express();

connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(userRoutes);
app.use(audioRoutes);
//app.use(transactionRoutes);
//app.use(authRoutes);
//app.use(accessRoutes);

app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err,
    });
  });
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello there! Welcome to Sound Vault.",
    api_doc: "",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server started on ${PORT}`);
});
