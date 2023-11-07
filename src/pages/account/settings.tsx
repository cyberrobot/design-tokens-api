import Head from "next/head";
import {
  type GetServerSidePropsContextWithSession,
  withSession,
} from "~/server/withSession";
import { type InferGetServerSidePropsType } from "next";
import prisma from "client";
import { type User } from "@prisma/client";
import { UserDetailsForm } from "~/components/UserDetailsForm";
import { PasswordReset } from "~/components/PasswordReset";

export const getServerSideProps = withSession<{
  user: User | null;
}>(async ({ session }: GetServerSidePropsContextWithSession) => {
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });
  return {
    props: {
      user: JSON.parse(JSON.stringify(user)) as User,
    },
  };
});

// Create a settings page. Add a form with username, email and password fields.
// Add a button to update the user's settings.
// Add an option to delete the user's account.
// Add an option to change the user's password.

export default function Settings({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const user = api.user.get.useQuery(undefined, {
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false,
  // });

  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="Update user settings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserDetailsForm user={user} />
      <PasswordReset />
    </>
  );
}
