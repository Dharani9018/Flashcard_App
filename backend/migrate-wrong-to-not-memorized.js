import mongoose from "mongoose";
import dotenv from "dotenv";
import Folder from "./models/Folder.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

async function migrateWrongCards() {
    try {
        console.log("🔄 Starting migration: Converting 'wrong' status to 'not-memorized'...");
        
        // Find all folders
        const folders = await Folder.find({});
        let convertedCount = 0;
        
        for (const folder of folders) {
            let folderUpdated = false;
            
            for (let i = 0; i < folder.flashcards.length; i++) {
                if (folder.flashcards[i].status === "wrong") {
                    folder.flashcards[i].status = "not-memorized";
                    convertedCount++;
                    folderUpdated = true;
                }
            }
            
            if (folderUpdated) {
                await folder.save();
                console.log(`✓ Folder "${folder.name}": converted cards`);
            }
        }
        
        console.log(`\n✅ Migration complete! Converted ${convertedCount} cards from 'wrong' to 'not-memorized'`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

migrateWrongCards();
