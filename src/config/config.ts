import "dotenv/config";
import { z } from "zod";


const ENVSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    AUTH_URL: z.url(),
    AUTH_SECRET: z.string().min(1),

    MONGODB_URI: z.string().min(1),

    SALT_ROUNDS: z.coerce.number().int().positive(),

    VERIFICATION_TOKEN_TTL: z.string().regex(/^\d+[mhd]$/),
    PASSWORD_RESET_TOKEN_TTL: z.string().regex(/^\d+[mhd]$/),

    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
    SMTP_SECURE: z.coerce.boolean().default(false),
    SMTP_USER: z.string().min(1),
    SMTP_PASSWORD: z.string().min(1),
    SMTP_FROM: z.string(),

    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional()
});

const parsedENV = ENVSchema.safeParse(process.env);

if (!parsedENV.success) {
    throw new Error(
        `Environment validation failed:\n${parsedENV.error.message}`
    );
}

export const ENV = parsedENV.data;