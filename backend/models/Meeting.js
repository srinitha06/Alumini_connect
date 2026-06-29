const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
    alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    agenda: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true }, 
    durationMinutes: { type: Number, default: 60 },
    location: { type: String, required: true },
    registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    maxAttendees: { type: Number, default: 0 }, // 0 means unlimited
}, { timestamps: true });

const Meeting = mongoose.model("Meeting", meetingSchema);
module.exports = Meeting;
