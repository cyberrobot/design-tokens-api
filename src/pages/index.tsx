import Head from "next/head";
import { useRef, useState } from 'react';
import { type Transform } from '~/server/api/routers/get-token';
import { api } from '~/utils/api';

export default function Home() {
  const [formData, setFormData] = useState<{
    id: string;
    namespaces: string[];
    transforms: Transform[];
  }>({
    id: '',
    namespaces: [],
    transforms: [],
  })

  const mutation = api.import.file.useMutation();
  const query = api.token.get.useQuery(formData);
  const idInputRef = useRef<HTMLInputElement>(null);
  const namespace1InputRef = useRef<HTMLInputElement>(null);
  const namespace2InputRef = useRef<HTMLInputElement>(null);

  const fileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        if (evt?.target?.result) {
          mutation.mutate({ file: (evt?.target?.result).toString() });
        }
      }
    }
  };

  const tokenRequestHandler = () => {
    const id = idInputRef.current?.value;
    const namespace1 = namespace1InputRef.current?.value;
    const namespace2 = namespace2InputRef.current?.value;
    if (id && namespace1 && namespace2) {
      setFormData({ id, namespaces: [namespace1, namespace2], transforms: ['scss', 'web'] });
    }
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Upload file
          </h1>
          <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={fileUploadHandler} />
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Request token
          </h1>
          <div className="join gap-3">
            <label className="label text-white">ID:</label>
            <input ref={idInputRef} type="text" className="input input-bordered" />
          </div>
          <div className="join gap-3">
            <label className="label text-white">Namespace:</label>
            <input ref={namespace1InputRef} type="text" className="input input-bordered" />
          </div>
          <div className="join gap-3">
            <label className="label text-white">Namespace:</label>
            <input ref={namespace2InputRef} type="text" className="input input-bordered" />
          </div>
          <button className="btn btn-primary" onClick={tokenRequestHandler}>Request</button>
          <div className='text-white'>
            <pre className="w-[1000px] overflow-auto">
              <code className="w-full">
                {query.data && JSON.stringify(query.data, null, 2)}
              </code>
            </pre>
          </div>
        </div>
      </main>
    </>
  );
}
