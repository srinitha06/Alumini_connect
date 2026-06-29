const Job = require("../models/Job");

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("postedBy", "name email").sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error("Fetch Jobs Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createJob = async (req, res) => {
    try {
        const { company, role, location, description, requirements, skills, salary, type } = req.body;
        const job = await Job.create({
            company,
            role,
            location,
            description,
            requirements,
            skills,
            salary,
            type,
            postedBy: req.user._id
        });
        res.status(201).json(job);
    } catch (error) {
        console.error("Create Job Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getJobs, createJob };
