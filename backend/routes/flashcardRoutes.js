import express from "express";
import Folder from "../models/Folder.js";

const router = express.Router();

// Add flashcard to folder
router.post("/add", async (req, res) => {
    const { folderId, question, answer } = req.body;

    try {
        const folder = await Folder.findById(folderId);
        folder.flashcards.push({ question, answer });
        await folder.save();

        res.json({ message: "Flashcard added", folder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update flashcard (edit)
router.put("/update", async (req, res) => {
    const { folderId, index, question, answer } = req.body;

    try {
        const folder = await Folder.findById(folderId);
        folder.flashcards[index].question = question;
        folder.flashcards[index].answer = answer;
        await folder.save();

        res.json({ message: "Flashcard updated", folder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete flashcard
router.put("/delete", async (req, res) => {
    const { folderId, index } = req.body;

    try {
        const folder = await Folder.findById(folderId);
        folder.flashcards.splice(index, 1);
        await folder.save();

        res.json({ message: "Flashcard deleted", folder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark flashcard status
router.put("/status", async (req, res) => {
    const { folderId, index, status } = req.body;

    try {
        const folder = await Folder.findById(folderId);
        folder.flashcards[index].status = status;
        await folder.save();

        res.json({ message: "Status updated", folder });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all "not memorized"
router.get("/not-memorized/:userId", async (req, res) => {
    try {
        const folders = await Folder.find({ userId: req.params.userId });
        let wrongCards = [];

        folders.forEach((folder) => {
            folder.flashcards.forEach((card) => {
                if (card.status === "wrong") wrongCards.push(card);
            });
        });

        res.json(wrongCards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Import multiple flashcards (array)
router.post("/import", async (req, res) => {
    const { folderId, cards } = req.body; // cards: [{question,answer}, ...]
    try {
        const folder = await Folder.findById(folderId);
        if (!folder) return res.status(404).json({ message: "Folder not found" });

        // sanitize incoming cards: keep only question+answer and trim
        const sanitized = (cards || []).map(c => ({
            question: (c.question || "").toString().trim(),
            answer: (c.answer || "").toString().trim(),
        })).filter(c => c.question && c.answer);

        folder.flashcards.push(...sanitized);
        await folder.save();

        // return the updated folder so frontend can use it if desired
        res.json({ message: `${sanitized.length} cards imported`, folder });
    } catch (err) {
        console.error("IMPORT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
