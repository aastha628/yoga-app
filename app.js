const express = require('express');
const app = express();
const path = require("path");
const morgan = require("morgan")
const batchRouter = require("./api/routes/batch");
const userRouter = require("./api/routes/users");
const paymentRouter = require("./api/routes/payment");
require("dotenv").config();

app.use(express.json());
app.use(morgan('dev'));

const { connectDb } = require("./utils/dbConnection");
connectDb();

app.use("/api/user", userRouter);
app.use("/api/batch", batchRouter);
app.use("/api/payment", paymentRouter);

app.use(express.static("public"));
app.use("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.use("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});
app.use("/batch", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "batch.html"));
});
app.use("/user-home", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "user-home.html"));
});
app.use("/payment", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "payment.html"));
});


app.use((req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    console.error(error);
    return res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;