import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    username: string,
    email: string,
    password?: string,
    image?: string,
    role: "user" | "admin",
    provider: "credentials" | "google" | "github",
    emailVerified: boolean,

    createdAt: Date,
    updatedAt: Date
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        password: {
            type: String,
            select: false
        },

        image: {
            type: String,
            default: null
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        provider: {
            type: String,
            enum: ["credentials", "google", "github"],
            required: true,
            default: "credentials",
        },

        emailVerified: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
);


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;