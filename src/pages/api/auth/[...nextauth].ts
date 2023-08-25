import {
  type NextApiRequest,
  type GetServerSidePropsContext,
  type NextApiResponse,
} from "next";
import NextAuth from "next-auth";

import { requestWrapper } from "~/server/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const wrappedRequest = requestWrapper(
    req as GetServerSidePropsContext["req"],
    res as GetServerSidePropsContext["res"],
    req.query as GetServerSidePropsContext["query"]
  );
  return (await NextAuth(
    wrappedRequest[0] as NextApiRequest,
    wrappedRequest[1] as NextApiResponse,
    wrappedRequest[2]
  )) as unknown;
}
