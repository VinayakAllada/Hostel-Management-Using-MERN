// lib/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () =>
            console.log("MongoDB Connected")
        );

        mongoose.connection.on("error", (err) =>
            console.error("MongoDB Error:", err.message)
        );

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};
