const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    mentorshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentorship", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
