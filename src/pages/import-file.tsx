import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import TokenImportSource from '~/components/TokenImportSource';
import { useTokenImportStore } from '~/stores/use-token-import';
import { api } from '~/utils/api';


function ImportFile() {
  const { updateToken, ...token } = useTokenImportStore(state => state);
  const router = useRouter()
  const mutation = api.import.save.useMutation();
  const importHandler = () => {
    mutation.mutate({
      name: token.name,
      description: token.description,
      file: token.content
    });
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      router.push('/tokens').catch(err => console.log(err));
    }

    return () => {
      updateToken({
        name: '',
        description: '',
        content: ''
      });
    }
  }, [mutation.isSuccess, router, updateToken])

  return (
    <>
      <Head>
        <title>Import Design Tokens</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col items-center px-20 mx-auto">
        <div className="mt-10 mb-6 self-start">
          <h1 className='text-5xl font-bold tracking-tight'>New token</h1>
        </div>
        <div className="flex gap-12 min-h-screen w-full">
          <div className="config lg:w-[50%] md:w-full">
            <div>
              <div className="mb-4 flex flex-col">
                <label htmlFor='token-name'>Name</label>
                <input id="token-name" type="text" name="token.name" className='input input-bordered bg-base-content w-full mt-2 text-base-300' placeholder='Brand A - Color' onChange={e => updateToken({ name: e.target.value })} />
              </div>
              <div className="mb-4 flex flex-col">
                <label>
                  Description
                </label>
                <textarea name="token.description" className='input input-bordered bg-base-content w-full mt-2 py-2 h-24 max-h-24 min-h-[96px] text-base-300' placeholder='Color styles for Brand A. Do not override!' onChange={e => updateToken({ description: e.target.value })} />
              </div>
            </div>
            <div className="mt-10">
              <TokenImportSource />
            </div>
            <div className="py-8 flex justify-end">
              <button className="btn btn-primary" onClick={() => importHandler()}>Import {mutation.isLoading && <span className="loading loading-dots loading-sm"></span>}</button>
            </div>
          </div>
          {token.content && <div className="token-preview lg:w-[50%] md:w-full">
            <h2 className="mb-4 text-xl font-bold tracking-tight">Preview</h2>
            <pre className="text-sm bg-neutral p-4 rounded-md h-[572px] overflow-y-auto">{token.content}</pre>
          </div>}
        </div>
      </main>
    </>
  )
}

export default ImportFile