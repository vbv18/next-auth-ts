"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useState,
    useTransition,
} from "react";

export default function RegisterForm() {

    const router = useRouter();

    const [isPending, startTransition] = useTransition();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError("");
        setSuccess("");

        startTransition(async () => {
            try {
                const response = await axios.post(
                    "/api/register",
                    {
                        username,
                        email,
                        password
                    }
                );

                const data = response.data;

                setSuccess(
                    data.message ??
                    "Verification email sent"
                );

                setUsername("");
                setEmail("");
                setPassword("");

                setTimeout(() => {
                    router.push("/login");
                }, 2000);

            } catch {
                setError(
                    "Something went wrong"
                );
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            <div>
                <label
                    htmlFor="username"
                    className="block mb-1 text-sm font-medium"
                >
                    Username
                </label>

                <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 outline-none"
                />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium"
                >
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 outline-none"
                />
            </div>

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            {success && (
                <p className="text-sm text-green-600">
                    {success}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-md border px-4 py-2 font-medium hover:bg-gray-100 disabled:opacity-50"
            >
                {isPending
                    ? "Creating Account..."
                    : "Register"}
            </button>

            <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="underline"
                >
                    Login
                </Link>
            </p>
        </form>
    );
}