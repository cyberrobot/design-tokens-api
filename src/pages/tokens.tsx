import { useState } from 'react';
import Modal from '~/components/Modal';
import { api } from '~/utils/api';

function Tokens() {
  const [contentModal, setContentModal] = useState({
    heading: '',
    body: '',
    isOpen: false
  });
  const query = api.tokens.getTokens.useQuery();
  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col gap-8 p-8 bg-[#15162c] rounded-md mt-8 shadow-sm">
          <h2 className="text-5xl font-regular tracking-tight text-white sm:text-[2rem]">
            Tokens
          </h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-white"></th>
                  <th className="text-white">ID</th>
                  <th className="text-white">Created</th>
                  <th className="text-white">Token</th>
                </tr>
              </thead>
              <tbody>
                {query.data?.map((token, index) => (
                  <tr key={token.id}>
                    <td className="text-white">{index + 1}</td>
                    <td className="text-white">{token.id}</td>
                    <td className="text-white">{token.createdAt.toLocaleDateString()} - {token.createdAt.toLocaleTimeString()}</td>
                    <td className="text-white">
                      <a href="" className="text-blue-400 underline" onClick={(e) => {
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
    </>
  )
}

export default Tokens