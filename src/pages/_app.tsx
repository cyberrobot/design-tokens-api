import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AuthenticatedLayout>
        <Component {...pageProps} />
      </AuthenticatedLayout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
