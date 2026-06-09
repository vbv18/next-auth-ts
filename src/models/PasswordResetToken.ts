import mongoose, { Schema } from "mongoose";


interface IPasswordResetToken {
    email: string,
    token: string,
    expires: Date
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            index: true
        },

        token: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        expires: {
            type: Date,
            required: true,
            index: { expires: 0 },
        }
    },
    {
        timestamps: true
    }
);

const PasswordResetToken = mongoose.models.PasswordResetToken || mongoose.model("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetToken;