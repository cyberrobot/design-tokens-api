import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import Credentials from "next-auth/providers/credentials";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { prisma } from "~/server/db";
import { loginSchema } from "~/schemas/auth";
import { verify } from "argon2";
import { randomUUID } from "crypto";
import Cookies from "cookies";
import { decode, encode } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const sessionCookieName = "next-auth.session-token";

export function requestWrapper(
  req: GetServerSidePropsContext["req"],
  res: GetServerSidePropsContext["res"],
  query: GetServerSidePropsContext["query"]
): [
  req: GetServerSidePropsContext["req"],
  res: GetServerSidePropsContext["res"],
  authOptions: NextAuthOptions
] {
  const generateSessionToken = () => randomUUID();
  const fromDate = (time: number, date = Date.now()) =>
    new Date(date + time * 1000);
  const adapter = PrismaAdapter(prisma);

  /**
   * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
   *
   * @see https://next-auth.js.org/configuration/options
   */
  const authOptions: NextAuthOptions = {
    pages: {
      newUser: "/sign-up",
      signIn: "/login",
    },
    callbacks: {
      session: ({ session, user }) => ({
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      }),
      async signIn({ user }) {
        if (
          query.nextauth?.includes("callback") &&
          query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          if (user) {
            const sessionToken = generateSessionToken();
            const sessionMaxAge = 60 * 60 * 24 * 30; // 30 Days
            const sessionExpiry = fromDate(sessionMaxAge);

            if (adapter.createSession) {
              await adapter.createSession({
                sessionToken: sessionToken,
                userId: user.id,
                expires: sessionExpiry,
              });
            }

            const cookies = new Cookies(req, res);

            cookies.set(sessionCookieName, sessionToken, {
              expires: sessionExpiry,
            });
          }
        }

        return true;
      },
    },
    jwt: {
      encode: async ({ token, secret, maxAge }) => {
        if (
          query.nextauth?.includes("callback") &&
          query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get(sessionCookieName);
          if (cookie) return cookie;
          else return "";
        }

        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          query.nextauth?.includes("callback") &&
          query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }

        return decode({ token, secret });
      },
    },
    adapter,
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          email: {
            label: "Email",
            type: "email",
            placeholder: "jsmith@gmail.com",
          },
          password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
          const schemaValidCredentials = await loginSchema.parseAsync(
            credentials
          );

          const user = await prisma.user.findFirst({
            where: { email: schemaValidCredentials.email },
          });

          if (!user) {
            return null;
          }

          const isValidPassword = await verify(
            user.password,
            schemaValidCredentials.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
          };
        },
      }),
    ],
  };

  return [req, res, authOptions];
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
  query: GetServerSidePropsContext["query"];
}) => {
  const wrappedRequest = requestWrapper(ctx.req, ctx.res, ctx.query);
  return getServerSession(...wrappedRequest);
};
