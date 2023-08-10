import { useEffect, useState } from 'react';
import { FaGithub, FaFileImport } from "react-icons/fa6";
import { useTokenImportStore } from '~/stores/use-token-import';
import { api } from '~/utils/api';

export default function TokenImportSource() {
  const [gitHubPath, setGithubPath] = useState('');
  const [activeTab, setActiveTab] = useState<number>(0)
  const updateToken = useTokenImportStore((state) => state.updateToken);
  const fileUploadMutation = api.import.file.useMutation();
  const githubMutation = api.import.github.useMutation();
  const githubImportHandler = () => {
    if (gitHubPath === '') return;
    githubMutation.mutate({
      path: gitHubPath
    });
  };
  const fileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        if (evt?.target?.result) {
          fileUploadMutation.mutate({ file: (evt?.target?.result).toString() });
        }
      }
    }
  };
  const tabsHandler = (index: number) => {
    setActiveTab(index)
    githubMutation.reset();
    fileUploadMutation.reset();
  }

  useEffect(() => {
    if (githubMutation.data && "content" in githubMutation.data) {
      updateToken({
        content: Buffer.from(githubMutation.data.content, 'base64').toString('utf-8')
      })
    }

    if (fileUploadMutation.data) {
      updateToken({
        content: fileUploadMutation.data
      })
    }
  }, [fileUploadMutation.data, githubMutation.data, updateToken])


  return (
    <>
      <div className="flex gap-3 justify-center mb-6">
        <button className={`${activeTab === 0 ? '' : 'btn-ghost'} btn btn-lg`} onClick={() => tabsHandler(0)}><FaGithub size={36} /></button>
        <button className={`btn ${activeTab === 1 ? '' : 'btn-ghost'} btn-lg`} onClick={() => tabsHandler(1)}><FaFileImport size={36} /></button>
      </div>
      {activeTab === 0 && <div className="flex flex-col gap-4 mt-5 shadow-sm">
        <h2 className="text-xl font-regular tracking-tight">
          GitHub import
        </h2>
        <div>
          <p className="text-white">Enter the GitHub repository file path</p>
          <div className="join mt-2 w-full">
            <div className={`join-item bg-base-100 border-base-300 border-[1px] rounded-md flex items-center px-3 pr-[1px] ${!githubMutation.isLoading && githubMutation.isSuccess ? 'border-success' : ''}`}>
              <FaGithub size={24} /><span className="ml-2">https://github.com/</span>
            </div>
            <input value={gitHubPath} onChange={(e) => setGithubPath(e.target.value)} type="text" placeholder="path/to/the/file" className={`input input-bordered join-item pl-0 focus:outline-none border-l-0 w-full ${!githubMutation.isLoading && githubMutation.isSuccess ? 'input-success' : ''}`} />
            <button className={`btn join-item ${!githubMutation.isLoading && githubMutation.isSuccess ? 'btn-success' : ''}`} onClick={githubImportHandler}>Add {githubMutation.isLoading && <span className="loading loading-dots loading-sm"></span>}</button>
          </div>
          {!githubMutation.isLoading && githubMutation.isError && <p className="text-error mt-4">Error: {githubMutation.error.message}</p>}
        </div>
      </div>}
      {activeTab === 1 && <div className="flex flex-col gap-4 mt-5 shadow-sm">
        <h2 className="text-xl font-regular tracking-tight">
          Upload file
        </h2>
        <input type="file" className={`file-input file-input-bordered w-full focus:outline-none ${!fileUploadMutation.isLoading && fileUploadMutation.isSuccess ? 'input-success' : ''}`} onChange={fileUploadHandler} />
        {!fileUploadMutation.isLoading && fileUploadMutation.isError && <p className="text-error mt-4">Error: {fileUploadMutation.error.message}</p>}
      </div>}
    </>
  )
}
