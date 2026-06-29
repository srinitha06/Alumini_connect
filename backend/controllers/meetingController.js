const Meeting = require("../models/Meeting");
const Mentorship = require("../models/Mentorship");
const Notification = require("../models/Notification");

// Create a meeting (Alumni only)
exports.createMeeting = async (req, res) => {
    try {
        const { title, description, agenda, date, time, durationMinutes, location, maxAttendees } = req.body;
        
        // Create the meeting
        const meeting = new Meeting({
            alumniId: req.user._id,
            title,
            description,
            agenda,
            date,
            time,
            durationMinutes,
            location,
            maxAttendees
        });
        await meeting.save();

        // Find all students connected to this alumni
        const connectedMentorships = await Mentorship.find({ 
            alumniId: req.user._id, 
            status: "accepted" 
        });

        // Create notifications for each connected student
        const notifications = connectedMentorships.map(mentorship => ({
            userId: mentorship.studentId,
            type: "meeting_scheduled",
            senderId: req.user._id,
            relatedId: meeting._id,
            content: `Your mentor ${req.user.name} has scheduled a new meeting: ${title}`
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({ message: "Meeting scheduled successfully", meeting });
    } catch (error) {
        console.error("Create meeting error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get meetings based on role
exports.getMeetings = async (req, res) => {
    try {
        let meetings = [];
        if (req.user.role === "admin") {
            // Admin sees all meetings with full details
            meetings = await Meeting.find()
                .populate("alumniId", "name department batch")
                .populate("registeredStudents", "name department batch")
                .sort({ date: -1 });
        } else if (req.user.role === "alumni") {
            // Alumni sees their own meetings
            meetings = await Meeting.find({ alumniId: req.user._id })
                .sort({ date: -1 });
        } else if (req.user.role === "student") {
            // Student sees meetings from their accepted mentors
            const acceptedMentorships = await Mentorship.find({ 
                studentId: req.user._id, 
                status: "accepted" 
            });
            const alumniIds = acceptedMentorships.map(m => m.alumniId);
            
            meetings = await Meeting.find({ alumniId: { $in: alumniIds } })
                .populate("alumniId", "name role_title company")
                .sort({ date: -1 });
        }

        res.json(meetings);
    } catch (error) {
        console.error("Get meetings error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Register for a meeting (Student only)
exports.registerForMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const meeting = await Meeting.findById(id);

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        // Check if student is already registered
        if (meeting.registeredStudents.includes(req.user._id)) {
            // If already registered, unregister them
            meeting.registeredStudents = meeting.registeredStudents.filter(
                studentId => studentId.toString() !== req.user._id.toString()
            );
            await meeting.save();
            return res.json({ message: "Unregistered successfully", registered: false });
        }

        // Check max attendees capacity if set
        if (meeting.maxAttendees > 0 && meeting.registeredStudents.length >= meeting.maxAttendees) {
             return res.status(400).json({ message: "Meeting has reached maximum capacity" });
        }

        // Register student
        meeting.registeredStudents.push(req.user._id);
        await meeting.save();
        
        // Notify alumni
        const notification = new Notification({
            userId: meeting.alumniId,
            type: "meeting_scheduled", // Reusing type for simplicity or could add new one
            senderId: req.user._id,
            relatedId: meeting._id,
            content: `${req.user.name} has registered for your meeting: ${meeting.title}`
        });
        await notification.save();

        res.json({ message: "Registered successfully", registered: true });
    } catch (error) {
        console.error("Register meeting error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
