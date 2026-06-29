const mongoose = require("mongoose");

const placementStatSchema = new mongoose.Schema({
    totalPlacements: { type: String, required: true },
    activeMentorships: { type: String, required: true },
    companiesOnboarded: { type: String, required: true },
    platformEngagement: { type: String, required: true },
    placementsIncrease: { type: String, required: true },
    mentorshipsIncrease: { type: String, required: true },
    companiesIncrease: { type: String, required: true },
    engagementIncrease: { type: String, required: true },
    topCompanies: { type: [mongoose.Schema.Types.Mixed], default: [] },
    yearlyTrend: { type: [mongoose.Schema.Types.Mixed], default: [] },
    trendingSkills: { type: [mongoose.Schema.Types.Mixed], default: [] },
    departmentPlacement: { type: [mongoose.Schema.Types.Mixed], default: [] },
    salaryDistribution: { type: [mongoose.Schema.Types.Mixed], default: [] },
    jobTypeDistribution: { type: [mongoose.Schema.Types.Mixed], default: [] },
    placementStatus: { type: [mongoose.Schema.Types.Mixed], default: [] },
}, { timestamps: true });

const PlacementStat = mongoose.model("PlacementStat", placementStatSchema);
module.exports = PlacementStat;
