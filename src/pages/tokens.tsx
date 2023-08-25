import { type Imports } from '@prisma/client';
import { useState } from 'react';
import { api } from '~/utils/api';
import { FaPlus } from 'react-icons/fa6';
import Link from 'next/link';
import { type GetServerSideProps } from 'next';
import { withSession } from '~/server/withSession';

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = withSession(async () => {
  return { props: {} }
})

function Tokens() {
  const [tokensToTransform, setTokensToTransform] = useState<Imports[]>([])
  const query = api.tokens.getTokens.useQuery(undefined, {
    refetchOnWindowFocus: false
  });
  const handleTokenSelect = (e: React.ChangeEvent<HTMLInputElement>, token: Imports) => {
    setTokensToTransform(e.target.checked ? [...tokensToTransform, token] : tokensToTransform.filter(tokenToTransform => token.id !== tokenToTransform.id))
  }
  // const hasTokensToTransform = tokensToTransform.length > 0

  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col gap-8 p-8 bg-neutral rounded-md mt-8 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="join gap-3 items-center">
              <h2 className="text-5xl font-regular tracking-tight  sm:text-[2rem]">
                Tokens
              </h2>
              <Link className="btn btn-xs btn-outline btn-circle" href="/new-token"><FaPlus /></Link>
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
                    <td><input type="checkbox" className="checkbox checkbox-primary" onChange={(e) => handleTokenSelect(e, token)} /></td>
                    <td>{token.name}</td>
                    <td>{token.createdAt.toLocaleDateString()} - {token.createdAt.toLocaleTimeString()}</td>
                    <td>
                      <Link href={`/tokens/${token.id}`} className="text-primary underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}

export default Tokens