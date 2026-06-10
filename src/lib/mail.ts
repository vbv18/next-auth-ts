import { ENV } from "@/config/config";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_SECURE,
    auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASSWORD
    }
});

export async function sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${ENV.AUTH_URL}` + `/verify-email?token=${token}`;

    await transporter.sendMail({
        from: ENV.SMTP_FROM,
        to: email,
        subject: "Verify your email",
        html: `
            <h2>Email Verification</h2>

            <p>
                Click the button below
                to verify your account.
            </p>

            <a href="${verificationUrl}">
                Verify Email
            </a>

            <p>
                This link expires in 1 hour.
            </p>
        `
    });
}