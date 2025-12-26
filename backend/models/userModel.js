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

const folderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    flashcards: [flashcardSchema]
});

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    folders: [folderSchema]  // Embedded folders array
});

export default mongoose.model("User", userSchema);