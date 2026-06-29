const PlacementStat = require("../models/PlacementStat");

const getStats = async (req, res) => {
    try {
        let stats = await PlacementStat.findOne();
        if (!stats) {
            // Create default stats if none exist
            stats = await PlacementStat.create({
                totalPlacements: "342", placementsIncrease: "+12%",
                activeMentorships: "89", mentorshipsIncrease: "+24%",
                companiesOnboarded: "45", companiesIncrease: "+5%",
                platformEngagement: "94%", engagementIncrease: "+2%",
                topCompanies: [
                    { company: "Google", hires: 45, avgPackage: "24" },
                    { company: "Microsoft", hires: 38, avgPackage: "22" },
                    { company: "Amazon", hires: 32, avgPackage: "20" },
                    { company: "TCS", hires: 85, avgPackage: "7" },
                    { company: "Infosys", hires: 65, avgPackage: "6" }
                ],
                yearlyTrend: [
                    { year: "2021", avgPackage: 8.5 },
                    { year: "2022", avgPackage: 10.2 },
                    { year: "2023", avgPackage: 12.8 },
                    { year: "2024", avgPackage: 15.4 },
                    { year: "2025", avgPackage: 18.2 }
                ],
                trendingSkills: [
                    { skill: "React.js", demand: 95 },
                    { skill: "Node.js", demand: 88 },
                    { skill: "Python", demand: 82 },
                    { skill: "AWS", demand: 75 },
                    { skill: "Kubernetes", demand: 68 }
                ],
                departmentPlacement: [
                    { dept: "CSE", rate: 98 },
                    { dept: "ECE", rate: 92 },
                    { dept: "ME", rate: 85 },
                    { dept: "CE", rate: 80 }
                ],
                salaryDistribution: [
                    { range: "5-10L", count: 120 },
                    { range: "10-15L", count: 85 },
                    { range: "15-20L", count: 65 },
                    { range: "20-30L", count: 45 },
                    { range: "30L+", count: 27 }
                ],
                jobTypeDistribution: [
                    { name: "Full-time", value: 75 },
                    { name: "Internship", value: 15 },
                    { name: "Freelance", value: 10 }
                ],
                placementStatus: [
                    { status: "Placed", count: 342 },
                    { status: "Ongoing", count: 58 },
                    { status: "Higher Studies", count: 24 }
                ]
            });
        } else if (!stats.topCompanies || stats.topCompanies.length === 0) {
            // Update existing stats if missing charts data
            stats = await PlacementStat.findOneAndUpdate({}, {
                topCompanies: [
                    { company: "Google", hires: 45, avgPackage: "24" },
                    { company: "Microsoft", hires: 38, avgPackage: "22" },
                    { company: "Amazon", hires: 32, avgPackage: "20" },
                    { company: "TCS", hires: 85, avgPackage: "7" },
                    { company: "Infosys", hires: 65, avgPackage: "6" }
                ],
                yearlyTrend: [
                    { year: "2021", avgPackage: 8.5 },
                    { year: "2022", avgPackage: 10.2 },
                    { year: "2023", avgPackage: 12.8 },
                    { year: "2024", avgPackage: 15.4 },
                    { year: "2025", avgPackage: 18.2 }
                ],
                trendingSkills: [
                    { skill: "React.js", demand: 95 },
                    { skill: "Node.js", demand: 88 },
                    { skill: "Python", demand: 82 },
                    { skill: "AWS", demand: 75 },
                    { skill: "Kubernetes", demand: 68 }
                ],
                departmentPlacement: [
                    { dept: "CSE", rate: 98 },
                    { dept: "ECE", rate: 92 },
                    { dept: "ME", rate: 85 },
                    { dept: "CE", rate: 80 }
                ],
                salaryDistribution: [
                    { range: "5-10L", count: 120 },
                    { range: "10-15L", count: 85 },
                    { range: "15-20L", count: 65 },
                    { range: "20-30L", count: 45 },
                    { range: "30L+", count: 27 }
                ],
                jobTypeDistribution: [
                    { name: "Full-time", value: 75 },
                    { name: "Internship", value: 15 },
                    { name: "Freelance", value: 10 }
                ],
                placementStatus: [
                    { status: "Placed", count: 342 },
                    { status: "Ongoing", count: 58 },
                    { status: "Higher Studies", count: 24 }
                ]
            }, { new: true });
        }
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateStats = async (req, res) => {
    try {
        const updates = req.body;
        let stats = await PlacementStat.findOne();
        if (stats) {
            stats = await PlacementStat.findOneAndUpdate({}, updates, { new: true });
        } else {
            stats = await PlacementStat.create(updates);
        }
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getStats, updateStats };
