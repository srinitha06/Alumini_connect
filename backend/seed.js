const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Job = require("./models/Job");
const Mentorship = require("./models/Mentorship");

dotenv.config();

const alumniData = [
    {
        name: "Priya Sharma",
        email: "priya@example.com",
        password: "alumni123",
        role: "alumni",
        verified: true,
        department: "Computer Science",
        batch: "2019",
        company: "Google",
        experience: 5,
        skills: ["React", "Node.js", "Python", "AWS"],
        interests: ["Web Development", "Cloud Computing"]
    },
    {
        name: "Rahul Mehta",
        email: "rahul@example.com",
        password: "alumni123",
        role: "alumni",
        verified: true,
        department: "Computer Science",
        batch: "2018",
        company: "Microsoft",
        experience: 6,
        skills: ["Product Management", "Agile", "Leadership"],
        interests: ["Management", "Product"]
    },
    {
        name: "Sneha Patel",
        email: "sneha@example.com",
        password: "alumni123",
        role: "alumni",
        verified: true,
        department: "Electronics",
        batch: "2020",
        company: "Amazon",
        experience: 4,
        skills: ["Python", "Machine Learning", "TensorFlow"],
        interests: ["AI", "Data Science"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data (optional, but good for clean seed)
        // await User.deleteMany({ role: "alumni" });
        // await Job.deleteMany({});

        for (const u of alumniData) {
            const userExists = await User.findOne({ email: u.email });
            if (!userExists) {
                const createdAlumni = await User.create(u);

                // Create a sample job for each alumni
                await Job.create({
                    company: createdAlumni.company,
                    role: "Software Engineer Intern",
                    location: "Remote",
                    description: "Exciting opportunity to work with " + createdAlumni.company,
                    skills: createdAlumni.skills.slice(0, 2),
                    salary: "₹50k - ₹80k",
                    type: "Internship",
                    postedBy: createdAlumni._id
                });
            }
        }

        console.log("Database Seeded successfully ✅");
        process.exit();
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedDB();
