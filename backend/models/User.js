const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "alumni", "admin"], default: "student" },
    department: { type: String, required: true },
    batch: { type: String, required: true },
    company: { type: String },
    experience: { type: Number },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    verified: { type: Boolean, default: false },
    role_title: { type: String },
    location: { type: String },
    bio: { type: String },
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;