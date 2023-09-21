import { type VerificationToken } from "@prisma/client";
import { type GetServerSideProps } from "next";
import { verifyEmail } from "~/utils/verify-email";

export const getServerSideProps: GetServerSideProps<{
  token: VerificationToken["token"];
}> = async ({ params }) => {
  const token = params?.token as string;

  const user = await verifyEmail({
    token,
  });

  if (user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
    },
  };
};

export default function VerifyEmail() {
  return <div>Email validation failed</div>;
}
