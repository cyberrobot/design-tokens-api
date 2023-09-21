import { TRPCError } from "@trpc/server";
import nodemailer from "nodemailer";

export function setup() {
  const transport: nodemailer.Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.EMAIL_SECURE),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return transport;
}

export async function sendEmail({
  to,
  subject,
  html,
  transport,
}: {
  transport: nodemailer.Transporter;
} & nodemailer.SendMailOptions): Promise<nodemailer.SentMessageInfo> {
  if (!transport) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Email transport not setup",
    });
  }

  return transport.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}
