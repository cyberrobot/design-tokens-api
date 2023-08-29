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
      <div className="container mx-auto flex flex-col rounded-md bg-neutral p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="join items-center gap-3">
            <h2 className="font-regular text-5xl tracking-tight  sm:text-[2rem]">
              Tokens
            </h2>
            <Link
              className="btn-outline btn-xs btn-circle btn"
              href="/new-token"
            >
              <FaPlus />
            </Link>
          </div>
          {/* {hasTokensToTransform && <button className="btn btn-sm btn-outline" onClick={() => setTransformModal({
              ...transformModal,
              tokens: tokensToTransform,
              isOpen: true
            })}>Export</button>} */}
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Created</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.map((token) => (
                <tr key={token.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox-primary checkbox"
                      onChange={(e) => handleTokenSelect(e, token)}
                    />
                  </td>
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
