const Mentorship = require("../models/Mentorship");
const Notification = require("../models/Notification");

const getMyRequests = async (req, res) => {
    try {
        const requests = await Mentorship.find({ studentId: req.user._id })
            .populate("alumniId", "name company role_title")
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const sendRequest = async (req, res) => {
    try {
        const { alumniId, message } = req.body;
        const mentorship = await Mentorship.create({
            studentId: req.user._id,
            alumniId,
            message
        });

        // Notify Alumni
        await Notification.create({
            userId: alumniId,
            type: "mentorship_request",
            senderId: req.user._id,
            relatedId: mentorship._id,
            content: `${req.user.name} sent you a mentorship request`
        });

        res.status(201).json(mentorship);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getIncomingRequests = async (req, res) => {
    try {
        const requests = await Mentorship.find({ alumniId: req.user._id })
            .populate("studentId", "name department batch email skills")
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const respondToRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "accepted" or "rejected"

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const mentorship = await Mentorship.findOneAndUpdate(
            { _id: id, alumniId: req.user._id },
            { status },
            { new: true }
        ).populate("studentId", "name department batch email");

        if (!mentorship) {
            return res.status(404).json({ message: "Mentorship request not found" });
        }

        // Notify Student
        await Notification.create({
            userId: mentorship.studentId._id || mentorship.studentId,
            type: status === "accepted" ? "mentorship_accepted" : "mentorship_request",
            senderId: req.user._id,
            relatedId: mentorship._id,
            content: `Your mentorship request has been ${status} by ${req.user.name}`
        });

        res.json(mentorship);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getMyRequests, sendRequest, getIncomingRequests, respondToRequest };
