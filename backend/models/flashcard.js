import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    status: {
        type: String,
        enum: ["new", "memorized", "wrong"],
        default: "new",
    }
});

export default flashcardSchema;
