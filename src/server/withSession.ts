import { type GetServerSidePropsContext, type GetServerSideProps } from "next";
import { getServerAuthSession } from "./auth";

// export type GetServerSidePropsContextWithSession = GetServerSidePropsContext & {
//   session?: Session;
// };

// export type GetServerSidePropsWithSession<
//   P extends { [key: string]: unknown } = { [key: string]: unknown }
// > = (
//   context: GetServerSidePropsContextWithSession
// ) => Promise<GetServerSidePropsResult<P>>;

export const withSession =
  <T extends { [key: string]: unknown }>(func: GetServerSideProps<T>) =>
  async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };
