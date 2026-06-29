const Review = require("../models/Review");

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate("postedBy", "name email").sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createReview = async (req, res) => {
    try {
        const { company, role, rating, content, pros, cons, interviewProcess } = req.body;
        const review = await Review.create({
            company,
            role,
            rating,
            content,
            pros,
            cons,
            interviewProcess,
            postedBy: req.user._id
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
        if (!review) return res.status(404).json({ message: "Review not found" });
        res.json(review);
    } catch (error) {
         res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getReviews, createReview, updateReviewStatus };
