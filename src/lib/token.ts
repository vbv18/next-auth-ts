import crypto from "crypto";


export function generateToken() {
    const token = crypto.randomUUID();

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    return {
        token,
        tokenHash
    }
}