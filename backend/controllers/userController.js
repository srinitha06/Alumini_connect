const User = require("../models/User");

const getAllAlumni = async (req, res) => {
    try {
        // Only return verified alumni to public/students
        const filter = req.user.role === "admin" ? { role: "alumni" } : { role: "alumni", verified: true };
        const alumni = await User.find(filter).select("-password");
        res.json(alumni);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getUnverifiedAlumni = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        const alumni = await User.find({ role: "alumni", verified: false }).select("-password");
        res.json(alumni);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const verifyAlumni = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        const user = await User.findById(req.params.id);
        if (user && user.role === "alumni") {
            user.verified = true;
            await user.save();
            res.json({ message: "Alumni verified successfully" });
        } else {
            res.status(404).json({ message: "Alumni not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.department = req.body.department || user.department;
            user.batch = req.body.batch || user.batch;
            user.skills = req.body.skills || user.skills;
            user.interests = req.body.interests || user.interests;
            user.bio = req.body.bio || user.bio;
            user.role_title = req.body.role_title || user.role_title;
            user.location = req.body.location || user.location;
            if (req.body.company) user.company = req.body.company;
            if (req.body.experience) user.experience = req.body.experience;

            const updatedUser = await user.save();
            res.json({
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                department: updatedUser.department,
                batch: updatedUser.batch,
                skills: updatedUser.skills,
                interests: updatedUser.interests,
                bio: updatedUser.bio,
                verified: updatedUser.verified,
                token: req.headers.authorization.split(" ")[1] // Send back the same token
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getAllAlumni, getUnverifiedAlumni, verifyAlumni, updateProfile };
//   \