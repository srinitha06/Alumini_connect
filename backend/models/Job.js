const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, default: "" },
    skills: { type: [String], default: [] },
    salary: { type: String },
    type: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"], default: "Full-time" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
