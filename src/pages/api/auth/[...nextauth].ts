import { type NextApiRequest, type NextApiResponse } from "next";
import NextAuth from "next-auth";

import { requestWrapper } from "~/server/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return (await NextAuth(...requestWrapper(req, res))) as unknown;
}
