const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Utility: Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    console.log("Register Request Body:", req.body);
    const { name, email, password, role, department, batch, company, experience, skills, interests } = req.body;

    // Block regular registration for admin role
    const finalRole = role === "admin" ? "student" : role;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: finalRole,
            department,
            batch,
            company,
            experience,
            skills,
            interests,
            verified: finalRole === "student", // Students auto-verified; alumni need admin approval
        });

        if (user) {
            res.status(201).json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.verified,
                department: user.department,
                skills: user.skills,
                interests: user.interests,
                token: user.verified ? generateToken(user._id) : undefined,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });

        }
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    console.log("Login Request Body:", req.body);
    const { email, password } = req.body;

    // Hardcoded Admin Access
    if (email === "admin@gmail.com" && password === "admin123") {
        return res.json({
            id: "admin_default_id",
            name: "System Admin",
            email: "admin@gmail.com",
            role: "admin",
            verified: true,
            department: "Administration",
            skills: ["Management", "Security"],
            interests: ["Platform Oversight"],
            token: generateToken("admin_default_id"),
        });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Check verification for Alumni
            if (user.role === "alumni" && !user.verified) {
                return res.status(403).json({ message: "Account pending admin verification." });
            }

            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.verified,
                department: user.department,
                skills: user.skills,
                interests: user.interests,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = { registerUser, loginUser };
