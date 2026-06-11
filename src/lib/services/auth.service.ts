import crypto from "crypto";

import User from "@/models/user.model";
import VerificationToken from "@/models/VerificationToken";

import { connectDB } from "../mongodb";
import { ENV } from "@/config/config";


export async function verifyEmailToken(token: string) {

    try {
        await connectDB();

        // create hash and find verificationToken
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const verificationToken = await VerificationToken.findOne({
            tokenHash
        })

        if (!verificationToken) {
            return {
                success: false,
                message: "Invalid Token"
            };
        }

        // check token expiry
        if (verificationToken.expires < new Date()) {
            await VerificationToken.deleteOne({
                _id: verificationToken._id
            });

            return {
                success: false,
                message: "Token expired"
            };
        }

        // find user
        const user = await User.findOne({
            email: verificationToken.email
        });

        if (!user) {
            return {
                success: false,
                message: "User not found"
            };
        }

        // check if user already verified
        if (user.emailVerified) {
            await VerificationToken.deleteMany({
                email: user.email,
            });

            return {
                success: true,
                message: "Email already verified",
            };
        }

        // mark verified and delete token from DB
        user.emailVerified = true;
        await user.save();

        await VerificationToken.deleteOne({
            _id: verificationToken._id
        })

        return {
            success: true,
            message:
                "Email verified successfully",
        }

    } catch (error) {
        if (ENV.NODE_ENV !== "production") console.error(error);
        return {
            success: false,
            message: "Internal server error"
        };
    }
}