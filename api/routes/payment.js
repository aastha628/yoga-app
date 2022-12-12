const express = require("express");
const router = express.Router();
const { makePayment } = require("../controllers/payment");
const { checkAuth } = require("../middleware/checkAuth");
const { updateDb } = require("../middleware/updateData");

router.post("/", checkAuth, updateDb, makePayment);

module.exports = router;
