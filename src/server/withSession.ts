import {
  type GetServerSidePropsResult,
  type GetServerSidePropsContext,
  type GetServerSideProps,
} from "next";
import { getServerAuthSession } from "./auth";
import { type Session } from "next-auth";

export type GetServerSidePropsContextWithSession = GetServerSidePropsContext & {
  session?: Session;
};

export type GetServerSidePropsWithSession<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
> = (
  context: GetServerSidePropsContextWithSession
) => Promise<GetServerSidePropsResult<P>>;

export const withSession =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const ctxWithSession = { ...ctx, session };

    return await func(ctx);
  };
