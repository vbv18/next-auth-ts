import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { LoginSchema } from "../validations/auth";
import { loginUser } from "@/lib/services/auth.service";
import { ENV } from "@/config/config";


export const authOptions = {
    secret: ENV.AUTH_SECRET,

    trustHost: true,

    pages: {
        signIn: "/login"
    },

    session: {
        strategy: "jwt"
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.username = user.username;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "user" | "admin";
                session.user.username = token.username as string;
            }

            return session;
        }
    },

    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {
                const parsed = LoginSchema.safeParse(credentials);

                if (!parsed.success) {
                    return null;
                }

                const { email, password } = parsed.data;

                return loginUser(email, password);
            },
        }),
    ],
} satisfies NextAuthConfig;