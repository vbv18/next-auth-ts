"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function LoginForm() {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        startTransition(async () => {
            const result = await signIn(
                "credentials",
                {
                    identifier,
                    password,
                    redirect: false
                }
            );

            if (!result.ok) {
                setError("Invalid credentials");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        });
    }


    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            <div>
                <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium"
                >
                    Username or Email
                </label>

                <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full rounded-md border px-3 py-2 outline-none"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block mb-1 text-sm font-medium"
                >
                    Password
                </label>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-md border px-3 py-2 outline-none"
                />
            </div>

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-md border px-4 py-2 font-medium hover:bg-gray-100 disabled:opacity-50"
            >
                {isPending ? "Signing In..." : "Sign In"}
            </button>
        </form>
    )
}