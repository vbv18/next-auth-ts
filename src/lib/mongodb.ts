import mongoose from "mongoose";
import { ENV } from "@/config/config";

const cached = global.mongooseCache ?? (
    global.mongooseCache = {
        conn: null,
        promise: null
    }
)

export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(ENV.MONGODB_URI);
    }

    try {
        cached.conn = await cached.promise;

    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}