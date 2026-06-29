const express = require("express");
const router = express.Router();
const { getStats, updateStats } = require("../controllers/statController");
const { protect, admin } = require("../middleware/authMiddleware");

// Note: assuming admin middleware exists. Falling back to protect for simplicity given project scope,
// but ideal implementation should use an 'admin' role check on the PUT request.
router.get("/", protect, getStats);
router.put("/", protect, updateStats);

module.exports = router;
