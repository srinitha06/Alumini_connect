const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createMeeting, getMeetings, registerForMeeting } = require("../controllers/meetingController");

const router = express.Router();

router.post("/", protect, createMeeting);
router.get("/", protect, getMeetings);
router.post("/:id/register", protect, registerForMeeting);

module.exports = router;
