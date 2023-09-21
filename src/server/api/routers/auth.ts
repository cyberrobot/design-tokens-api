import { signUpSchema } from "~/schemas/auth";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { randomUUID } from "crypto";
import { sendEmail, setup as mailServiceSetup } from "~/utils/mailer";
import { getVerifyEmailTemplate } from "~/utils/email-templates";
import { createUserAccount } from "~/utils/create-user-account";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { username, email, password } = input;

      const exists = await ctx.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const hashedPassword = await hash(password);

      const user = await ctx.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Unable to create user profile",
        });
      }

      await createUserAccount({
        user,
      });

      const verificationToken = await ctx.prisma.verificationToken.create({
        data: {
          identifier: email,
          token: randomUUID(),
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
      });

      if (verificationToken) {
        const transport = mailServiceSetup();
        await sendEmail({
          to: email,
          subject: "Verify email address for Atradis",
          html: getVerifyEmailTemplate({
            username,
            token: verificationToken.token,
          }),
          transport,
        }).catch(() => {
          throw new TRPCError({
            code: "CONFLICT",
            message: "There was an error sending the verification email",
          });
        });
      }

      if (!verificationToken) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Unable to create verification token",
        });
      }

      return {
        code: 200,
        message: "An email validation request was sent to your inbox",
      };
    }),
});
