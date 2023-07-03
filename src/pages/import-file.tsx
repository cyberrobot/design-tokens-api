import Head from 'next/head';
import React from 'react';
import { api } from '~/utils/api';

function ImportFile() {
  const mutation = api.import.file.useMutation();
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
  return (
    <>
      <Head>
        <title>Import file manually</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Upload file
          </h1>
          <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={fileUploadHandler} />
        </div>
      </main>
    </>
  )
}

export default ImportFile