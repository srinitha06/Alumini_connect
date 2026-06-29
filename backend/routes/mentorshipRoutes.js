const express = require("express");
const router = express.Router();
const {
    getMyRequests,
    sendRequest,
    getIncomingRequests,
    respondToRequest
} = require("../controllers/mentorshipController");
const { protect } = require("../middleware/authMiddleware");

router.get("/my-requests", protect, getMyRequests);
router.post("/request", protect, sendRequest);
router.get("/incoming-requests", protect, getIncomingRequests);
router.put("/respond/:id", protect, respondToRequest);

module.exports = router;
