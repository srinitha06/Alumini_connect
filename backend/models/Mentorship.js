const mongoose = require("mongoose");

const mentorshipSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    message: { type: String },
}, { timestamps: true });

const Mentorship = mongoose.model("Mentorship", mentorshipSchema);
module.exports = Mentorship;
