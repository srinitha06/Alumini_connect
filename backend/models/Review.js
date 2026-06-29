const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true },
    pros: { type: String },
    cons: { type: String },
    interviewProcess: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
