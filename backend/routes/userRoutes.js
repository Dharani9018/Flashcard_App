import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed
        });

        res.json({ message: "User registered successfully!", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        res.json({
            message: "Login successful!",
            user
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE EMAIL
router.put("/update-email", async (req, res) => {
    const { userId, newEmail, currentPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Incorrect current password" });

        user.email = newEmail;
        await user.save();

        res.json({ message: "Email updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE PASSWORD

router.put("/update-password", async (req, res) => {
    const { userId, newPassword, currentPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Incorrect current password" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;
