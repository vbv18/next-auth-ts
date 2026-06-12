import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user.model";
import VerificationToken from "@/models/VerificationToken";

import { hashPassword } from "@/lib/bcrypt";
import { sendVerificationEmail } from "@/lib/mail";
import { connectDB } from "@/lib/mongodb";
import { generateToken, VERIFICATION_TOKEN_TTL_MS } from "@/lib/token";
import { RegisterSchema } from "@/lib/validations/auth";


export async function POST(req: NextRequest) {

    try {
        // parse and validate request
        const body = await req.json();

        const parsed = RegisterSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid input",
                    error: parsed.error.flatten()
                },
                {
                    status: 400
                }
            );
        }

        // connect DB
        await connectDB();

        // check existing user
        const isExisting = await User.findOne({
            email: parsed.data.email
        });

        if (isExisting) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists",
                },
                {
                    status: 409
                }
            );
        }

        // check username availability
        const isUsernameUsed = await User.findOne({
            username: parsed.data.username
        });

        if (isUsernameUsed) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username not available.",
                },
                {
                    status: 409
                }
            );
        }

        // hash password and create user
        const passwordHash = await hashPassword(parsed.data.password);

        const user = await User.create({
            username: parsed.data.username,
            email: parsed.data.email,
            passwordHash,
            provider: "credentials",
            emailVerified: false
        })

        // verification
        const { token, tokenHash } = generateToken();

        await VerificationToken.deleteMany({
            email: user.email
        });

        await VerificationToken.create({
            email: user.email,
            tokenHash,
            expires: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS)
        });

        await sendVerificationEmail(
            user.email,
            token
        )

        return NextResponse.json(
            {
                success: true,
                message: "Verification email sent"
            },
            {
                status: 201
            }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }

}