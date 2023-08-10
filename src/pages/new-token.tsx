import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import TokenContent from '~/components/TokenContent';
import TokenImportSource from '~/components/TokenImportSource';
import { useTokenImportStore } from '~/stores/use-token-import';
import { api } from '~/utils/api';


function NewToken() {
  const { updateToken, ...token } = useTokenImportStore(state => state);
  const router = useRouter()
  const mutation = api.import.save.useMutation();
  const importHandler = () => {
    if (!token.name || !token.content) return;
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
      <main className="container min-h-screen flex flex-col items-center px-20 mx-auto">
        <div className="mt-10 mb-6 self-start">
          <h1 className='text-5xl font-bold tracking-tight'>New token</h1>
        </div>
        <div className="flex gap-12 w-full">
          <div className="config md:w-full lg:w-[50%]">
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
            <div className="bg-neutral rounded-md mb-6 mt-10">
              <h2 className='text-xl font-bold tracking-tight text-accent p-4 rounded-t-md border-b-[1px] border-accent'>Source</h2>
              <div className="pt-8 p-4">
                <TokenImportSource />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button className="btn btn-primary" onClick={() => importHandler()}>Save {mutation.isLoading && <span className="loading loading-dots loading-sm"></span>}</button>
              <Link href="/tokens" className="btn btn-outline">Back</Link>
            </div>
          </div>
          {token.content && <div className="token-preview md:w-full lg:w-[50%] hidden lg:block">
            <div className="mb-6 bg-neutral rounded-md">
              <h2 className='text-xl font-bold tracking-tight text-accent p-4 rounded-t-md border-b-[1px] border-accent'>Preview</h2>
              <div className="p-4 max-h-[580px] overflow-auto">
                <TokenContent body={token.content} />
              </div>
            </div>
          </div>}
        </div>
      </main>
    </>
  )
}

export default NewToken