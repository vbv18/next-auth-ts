import bcrypt from "bcrypt";
import { ENV } from "@/config/config";


export async function hashPassword(password: string) {
    if (!password) {
        throw new Error("Password is required");
    }

    return bcrypt.hash(password, ENV.SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string) {
    if (!password || !hashedPassword) {
        return false;
    }

    return bcrypt.compare(password, hashedPassword);
}