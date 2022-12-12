const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser, updateUser } = require("../controllers/user");
const { checkAuth } = require("../middleware/checkAuth")
const { checkPayment } = require("../middleware/checkPaymentStatus");
const { updateDb } = require("../middleware/updateData");


router.get("/", checkAuth, checkPayment, updateDb, getUser);
router.patch("/", checkAuth, updateDb, updateUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;