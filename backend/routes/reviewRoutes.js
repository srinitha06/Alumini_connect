const express = require("express");
const router = express.Router();
const { getReviews, createReview, updateReviewStatus } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getReviews);
router.post("/", protect, createReview);
router.put("/:id/status", protect, updateReviewStatus);

module.exports = router;
