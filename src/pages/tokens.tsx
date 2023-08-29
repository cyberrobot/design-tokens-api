import { type Imports } from "@prisma/client";
import { useState } from "react";
import { api } from "~/utils/api";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import { withSession } from "~/server/withSession";
import Head from "next/head";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = withSession(async () => {
  return { props: {} };
});

function Tokens() {
  const [tokensToTransform, setTokensToTransform] = useState<Imports[]>([]);
  const query = api.tokens.getTokens.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const handleTokenSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    token: Imports
  ) => {
    setTokensToTransform(
      e.target.checked
        ? [...tokensToTransform, token]
        : tokensToTransform.filter(
            (tokenToTransform) => token.id !== tokenToTransform.id
          )
    );
  };

  return (
    <>
      <Head>
        <title>Tokens</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex flex-col">
        <header className="join mb-6 items-center gap-3">
          <h1 className="text-4xl tracking-tight">Tokens</h1>
          <Link className="btn-outline btn-xs btn-circle btn" href="/new-token">
            <FaPlus />
          </Link>
        </header>
        <div className="overflow-x-auto rounded-md bg-neutral p-8">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.map((token) => (
                <tr key={token.id}>
                  <td>{token.name}</td>
                  <td>
                    {token.createdAt.toLocaleDateString()} -{" "}
                    {token.createdAt.toLocaleTimeString()}
                  </td>
                  <td>
                    <Link
                      href={`/tokens/${token.id}`}
                      className="text-primary underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Tokens;
