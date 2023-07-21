import { type FileImport } from '@prisma/client';
import { useState } from 'react';
import Modal from '~/components/Modal';
import AddToken from '~/components/AddToken';
import { usePlatformStore } from '~/stores/use-platform';
import { api } from '~/utils/api';

function Tokens() {
  const [contentModal, setContentModal] = useState({
    heading: '',
    body: '',
    isOpen: false
  });
  const [transformModal, setTransformModal] = useState<{
    heading: string;
    body: string;
    isOpen: boolean;
    tokens: FileImport[];
  }>({
    heading: 'Export token',
    body: '',
    isOpen: false,
    tokens: []
  })
  const [tokensToTransform, setTokensToTransform] = useState<FileImport[]>([])
  const clearPlatforms = usePlatformStore(state => state.clearPlatforms);
  const query = api.tokens.getTokens.useQuery(undefined, {
    refetchOnWindowFocus: false
  });
  const handleTokenSelect = (e: React.ChangeEvent<HTMLInputElement>, token: FileImport) => {
    setTokensToTransform(e.target.checked ? [...tokensToTransform, token] : tokensToTransform.filter(tokenToTransform => token.id !== tokenToTransform.id))
  }
  const hasTokensToTransform = tokensToTransform.length > 0

  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col gap-8 p-8 bg-neutral rounded-md mt-8 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-5xl font-regular tracking-tight  sm:text-[2rem]">
              Tokens
            </h2>
            {hasTokensToTransform && <button className="btn btn-sm btn-outline" onClick={() => setTransformModal({
              ...transformModal,
              tokens: tokensToTransform,
              isOpen: true
            })}>Export</button>}
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>Created</th>
                  <th>Token</th>
                </tr>
              </thead>
              <tbody>
                {query.data?.map((token) => (
                  <tr key={token.id}>
                    <td><input type="checkbox" className="checkbox checkbox-primary" onChange={(e) => handleTokenSelect(e, token)} /></td>
                    <td>{token.id}</td>
                    <td>{token.createdAt.toLocaleDateString()} - {token.createdAt.toLocaleTimeString()}</td>
                    <td>
                      <a href="" className="text-primary underline" onClick={(e) => {
                        e.preventDefault();
                        setContentModal({
                          heading: `Token ${token.id}`,
                          body: token.file,
                          isOpen: true
                        })
                      }}>View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Modal isOpen={contentModal.isOpen} heading={contentModal.heading} components={{
        Body: () => <pre className="text-sm py-4">{contentModal.body}</pre>
      }} onClose={() => setContentModal({
        ...contentModal,
        isOpen: false
      })} />
      <Modal isOpen={transformModal.isOpen} heading={transformModal.heading} components={{
        Body: () => <AddToken tokens={transformModal.tokens} />
      }} onClose={() => {
        setTransformModal({
          ...transformModal,
          isOpen: false
        })
        clearPlatforms();
      }} />
    </>
  )
}

export default Tokens