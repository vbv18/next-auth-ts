import mongoose, { Model, Schema } from "mongoose";


export interface IVerificationToken {
    email: string,
    tokenHash: string,
    expires: Date
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            index: true
        },

        tokenHash: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        expires: {
            type: Date,
            required: true,
            index: { expires: 0 }
        }
    },
    {
        timestamps: true,
    }
);

const VerificationToken: Model<IVerificationToken> = mongoose.models.VerificationToken || mongoose.model("VerificationToken", VerificationTokenSchema);

export default VerificationToken;