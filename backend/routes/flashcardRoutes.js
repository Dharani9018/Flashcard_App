import express from "express";
import User from "../models/userModel.js";

const router = express.Router();


router.put("/status", async (req, res) => {
    try {
        const { userId, folderIndex, cardIndex, status } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const folder = user.folders[folderIndex];
        if (!folder) return res.status(404).json({ error: "Folder not found" });

        const flashcard = folder.flashcards[cardIndex];
        if (!flashcard) return res.status(404).json({ error: "Flashcard not found" });

        const finalStatus = status === "wrong" ? "not-memorized" : status;
        flashcard.status = finalStatus;
        
        await user.save();

        res.json({ 
            message: "Status updated", 
            flashcard 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/not-memorized/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        let notMemorized = [];

        user.folders.forEach((folder, folderIndex) => {
            folder.flashcards.forEach((card, cardIndex) => {
                if (card.status === "not-memorized" || card.status === "wrong") {
                    notMemorized.push({
                        ...card.toObject(),
                        folderIndex: folderIndex,
                        folderName: folder.name,
                        cardIndex: cardIndex
                    });
                }
            });
        });

        res.json(notMemorized);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/add", async (req, res) => {
    const { userId, folderIndex, question, answer } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const folder = user.folders[folderIndex];
        if (!folder) return res.status(404).json({ error: "Folder not found" });

        folder.flashcards.push({ question, answer });
        await user.save();

        res.json({ 
            message: "Flashcard added", 
            flashcards: folder.flashcards 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put("/update", async (req, res) => {
    const { userId, folderIndex, cardIndex, question, answer } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const folder = user.folders[folderIndex];
        if (!folder) return res.status(404).json({ error: "Folder not found" });

        const flashcard = folder.flashcards[cardIndex];
        if (!flashcard) return res.status(404).json({ error: "Flashcard not found" });

        flashcard.question = question;
        flashcard.answer = answer;
        await user.save();

        res.json({ message: "Flashcard updated", flashcard });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete flashcard
router.delete("/delete", async (req, res) => {
    const { userId, folderIndex, cardIndex } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const folder = user.folders[folderIndex];
        if (!folder) return res.status(404).json({ error: "Folder not found" });

        if (!folder.flashcards[cardIndex]) {
            return res.status(404).json({ error: "Flashcard not found" });
        }

        folder.flashcards.splice(cardIndex, 1);
        await user.save();

        res.json({ message: "Flashcard deleted", flashcards: folder.flashcards });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Import multiple flashcards
router.post("/import", async (req, res) => {
    const { userId, folderIndex, cards } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const folder = user.folders[folderIndex];
        if (!folder) return res.status(404).json({ error: "Folder not found" });

        // Add all cards to folder
        folder.flashcards.push(...cards.map(card => ({
            question: card.question,
            answer: card.answer,
            status: "new"
        })));
        
        await user.save();

        res.json({ 
            message: `${cards.length} flashcards imported`, 
            flashcards: folder.flashcards 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;