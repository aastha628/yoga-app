const express = require("express");
const router = express.Router();
const { getBatches, batchDetails } = require("../controllers/batch");
const { checkAuth } = require("../middleware/checkAuth");

// returns details of all the available batches
router.get("/", getBatches);

router.get("/:batchId", batchDetails);

module.exports = router;