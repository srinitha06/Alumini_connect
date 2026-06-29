const Message = require("../models/Message");
const Mentorship = require("../models/Mentorship");
const Notification = require("../models/Notification");

const sendChatMessage = async (req, res) => {
    try {
        const { mentorshipId, receiverId, content } = req.body;

        // Verify mentorship exists and is accepted
        const mentorship = await Mentorship.findById(mentorshipId);
        if (!mentorship || mentorship.status !== "accepted") {
            return res.status(403).json({ message: "Can only message in accepted mentorships" });
        }

        const newMessage = await Message.create({
            mentorshipId,
            senderId: req.user._id,
            receiverId,
            content
        });

        // Create notification for receiver
        await Notification.create({
            userId: receiverId,
            type: "message",
            senderId: req.user._id,
            relatedId: mentorshipId,
            content: `New message from ${req.user.name}`
        });

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getChatMessages = async (req, res) => {
    try {
        const { mentorshipId } = req.params;

        const messages = await Message.find({ mentorshipId })
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { sendChatMessage, getChatMessages };
