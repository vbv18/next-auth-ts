import { NextRequest, NextResponse } from "next/server";

import { ResendVerificationSchema } from "@/lib/validations/auth";
import { resendVerification } from "@/lib/services/auth.service";


export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const parsed = ResendVerificationSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Email"
                },
                {
                    status: 400
                }
            );
        }

        const { email } = parsed.data;
        const result = await resendVerification(email);

        return NextResponse.json(result)

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Internal server error",
            },
            {
                status: 500,
            }
        );
    }

}