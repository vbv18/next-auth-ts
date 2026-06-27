import Link from "next/link";

import { verifyEmailToken } from "@/lib/services/auth.service";



export default async function VerifyEmailPage({ params }: { params: Promise<{ token: string }> }) {

    const { token } = await params;

    const result = await verifyEmailToken(token);

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="text-3xl font-medium flex flex-col gap-6">
                {result.success ? (
                    <>
                        <div className="flex justify-center">
                            Verified.
                        </div>
                        <Link
                            href="/login"
                            className="m-2 p-4 bg-gray-300 border border-gray-800 text-black text-2xl rounded-md"
                        >
                            Proced to Log In
                        </Link>
                    </>
                ) : (
                    <div className="flex justify-center">
                        Failed Verification
                    </div>
                )}
            </div>
        </div>
    );
}