const express = require("express");
const router = express.Router();
const { getAllAlumni, updateProfile, getUnverifiedAlumni, verifyAlumni } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/alumni", protect, getAllAlumni);
router.get("/unverified-alumni", protect, getUnverifiedAlumni);
router.put("/verify-alumni/:id", protect, verifyAlumni);
router.put("/profile", protect, updateProfile);

module.exports = router;
