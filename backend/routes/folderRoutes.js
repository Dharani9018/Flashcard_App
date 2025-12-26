import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// Create folder for user
router.post("/create", async (req, res) => {
    const { userId, name } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Add new folder to user's folders array
        user.folders.push({ name, flashcards: [] });
        await user.save();

        const newFolder = user.folders[user.folders.length - 1];
        res.json({ message: "Folder created", folder: newFolder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all folders for user
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user.folders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a folder
router.delete("/:userId/:folderIndex", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const folderIndex = parseInt(req.params.folderIndex);
        if (folderIndex < 0 || folderIndex >= user.folders.length) {
            return res.status(404).json({ error: "Folder not found" });
        }

        // Remove folder at specified index
        user.folders.splice(folderIndex, 1);
        await user.save();

        res.json({ message: "Folder deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;