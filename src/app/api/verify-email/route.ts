import { NextRequest, NextResponse } from "next/server";

import { verifyEmailToken } from "@/lib/services/auth.service";


export async function GET(req: NextRequest) {
    // extract token
    const { searchParams } = new URL(req.url);

    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json(
            {
                success: false,
                message: "Missing token"
            },
            {
                status: 400
            }
        );
    }

    // call auth.service
    const result = await verifyEmailToken(token);

    return NextResponse.json(
        result,
        {
            status: result.success ? 200 : 400
        }
    );
}