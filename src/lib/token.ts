import crypto from "crypto";
import ms, { type StringValue } from "ms";
import { ENV } from "@/config/config";

export const VERIFICATION_TOKEN_TTL_MS = ms(ENV.VERIFICATION_TOKEN_TTL as StringValue);
export const PASSWORD_RESET_TOKEN_TTL_MS = ms(ENV.PASSWORD_RESET_TOKEN_TTL as StringValue);

export function generateToken() {
    const token = crypto.randomUUID();

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    return {
        token,
        tokenHash
    }
}