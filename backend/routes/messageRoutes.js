const express = require("express");
const router = express.Router();
const { sendChatMessage, getChatMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.post("/send", protect, sendChatMessage);
router.get("/:mentorshipId", protect, getChatMessages);

module.exports = router;
