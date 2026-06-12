import crypto from "crypto";

import User from "@/models/user.model";
import VerificationToken from "@/models/VerificationToken";

import { connectDB } from "../mongodb";
import { ENV } from "@/config/config";
import { generateToken, VERIFICATION_TOKEN_TTL_MS } from "../token";
import { sendVerificationEmail } from "../mail";
import { verifyPassword } from "../bcrypt";


interface ServiceResponse {
    success: boolean,
    message: string
}

export async function verifyEmailToken(token: string): Promise<ServiceResponse> {

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

export async function resendVerification(email: string): Promise<ServiceResponse> {

    await connectDB();

    const user =
        await User.findOne({
            email,
        });

    if (!user) {
        return {
            success: true,
            message: "User not found"
        };
    }

    if (user.emailVerified) {
        return {
            success: true,
            message:
                "Email already verified.",
        };
    }

    await VerificationToken.deleteMany({
        email,
    });

    const { token, tokenHash } = generateToken();

    await VerificationToken.create({
        email,

        tokenHash,

        expires: new Date(
            Date.now() +
            VERIFICATION_TOKEN_TTL_MS
        ),
    });

    await sendVerificationEmail(
        email,
        token
    );

    return {
        success: true,
        message:
            "Verification email sent.",
    };
}

export async function loginUser(email: string, password: string): Promise<{
    id: string,
    email: string,
    username: string,
    role: "user" | "admin"
} | null> {

    await connectDB();

    // find user and select passwordHash
    const user = await User.findOne({
        email
    }).select("+passwordHash");

    if (!user) {
        return null;
    }

    if (!user.passwordHash) {
        return null;
    }

    // check is email is not verified
    if (!user.emailVerified) {
        return null;
    }

    // check password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
        return null;
    }

    return {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role
    };
}