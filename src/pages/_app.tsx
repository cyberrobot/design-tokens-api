import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { type NextPage } from "next";
import { type ReactElement, type ReactNode } from "react";
import Layout from "~/components/Layout";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<P> = AppProps<P> & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout<{ session: Session | null }>) {
  const getLayout =
    Component.getLayout ?? ((page: ReactElement) => <Layout>{page}</Layout>);
  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}

export default api.withTRPC(MyApp);
