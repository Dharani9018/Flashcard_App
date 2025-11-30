import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
    question: String,
    answer: String,
    status: { 
        type: String, 
        default: "new",
        enum: ["new", "memorized", "not-memorized"] 
    }
});

export default flashcardSchema;