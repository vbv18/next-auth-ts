import { z } from "zod";


export const RegisterSchema = z.object({
    username: z.string().trim().min(3),
    email: z.email().trim().transform(val => val.toLowerCase()),
    password: z.string().min(4)
});

export const ResendVerificationSchema = z.object({
    email: z.email().trim().transform(val => val.toLowerCase()),
});

