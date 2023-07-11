import Head from 'next/head';
import React, { useRef, useState } from 'react';
import { api } from '~/utils/api';
import { FaGithub, FaCheck } from "react-icons/fa6";

function ImportFile() {
  const [gitHubPath, setGithubPath] = useState('');
  const inputRef = useRef<HTMLInputElement>(null)
  const mutation = api.import.file.useMutation();
  const query = api.import.github.useQuery({
    path: inputRef.current?.value || '',
  }, {
    enabled: false,
  });
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
  const githubImportHandler = () => {
    const refetchFn = async () => {
      await query.refetch();
    };

    if (gitHubPath === '') return;
    refetchFn().catch((err) => { console.log(err) });
  };

  return (
    <>
      <Head>
        <title>Import Design Tokens</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col gap-8 px-4 py-8 bg-[#15162c] rounded-md mt-5 shadow-sm">
          <h2 className="text-5xl font-regular tracking-tight text-white sm:text-[2rem]">
            GitHub import
          </h2>
          <div>
            <p className="text-white">Enter the GitHub repository file path</p>
            <div className="join mt-2">
              <div className='join-item rounded-md bg-white flex items-center px-3 pr-[1px]'>
                <FaGithub size={24} /><span className="ml-2">https://github.com/</span>
              </div>
              <input ref={inputRef} value={gitHubPath} onChange={(e) => setGithubPath(e.target.value)} type="text" placeholder="path/to/the/file" className="input input-bordered join-item pl-0 focus:outline-none border-l-0 w-96" />
              <button className="btn btn-primary join-item" onClick={githubImportHandler}>Import {query.isFetching && <span className="loading loading-dots loading-sm"></span>}</button>
            </div>
            {query.isError && <p className="text-white">Error: {query.error.message}</p>}
            {query.isSuccess && <div className="text-white flex justify-between w-[653px] mt-3"><span>{query.data?.file}</span><span className="badge badge-success"><FaCheck /></span></div>}
          </div>
        </div>
        <div className="container flex flex-col gap-8 px-4 py-8 bg-[#15162c] rounded-md mt-5 shadow-sm">
          <h2 className="text-5xl font-regular tracking-tight text-white sm:text-[2rem]">
            Upload file
          </h2>
          <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={fileUploadHandler} />
        </div>
      </main>
    </>
  )
}

export default ImportFile