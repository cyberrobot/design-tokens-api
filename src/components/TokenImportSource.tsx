import { useEffect, useState } from "react";
import { FaGithub, FaFileImport } from "react-icons/fa6";
import { useTokenImportStore } from "~/stores/use-token-import";
import { api } from "~/utils/api";

export default function TokenImportSource() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const { updateToken, gitHubPath } = useTokenImportStore();
  const fileUploadMutation = api.import.file.useMutation();
  const githubMutation = api.import.github.useMutation();
  const githubImportHandler = () => {
    if (gitHubPath === "") return;
    githubMutation.mutate({
      path: gitHubPath,
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
      };
    }
  };
  const tabsHandler = (index: number) => {
    setActiveTab(index);
    githubMutation.reset();
    fileUploadMutation.reset();
  };

  useEffect(() => {
    if (githubMutation.data && "content" in githubMutation.data) {
      updateToken({
        file: Buffer.from(githubMutation.data.content, "base64").toString(
          "utf-8"
        ),
      });
    }

    if (fileUploadMutation.data) {
      updateToken({
        file: fileUploadMutation.data,
      });
    }
  }, [fileUploadMutation.data, githubMutation.data, updateToken]);

  return (
    <>
      <div className="mb-6 flex justify-center gap-3">
        <button
          type="button"
          className={`${activeTab === 0 ? "" : "btn-ghost"} btn-lg btn`}
          onClick={() => tabsHandler(0)}
        >
          <FaGithub size={36} />
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 1 ? "" : "btn-ghost"} btn-lg`}
          onClick={() => tabsHandler(1)}
        >
          <FaFileImport size={36} />
        </button>
      </div>
      {activeTab === 0 && (
        <div className="mt-5 flex flex-col gap-4 shadow-sm">
          <h2 className="font-regular text-xl tracking-tight">GitHub import</h2>
          <div className="join w-full">
            <div
              className={`join-item flex items-center rounded-md border-[1px] border-base-300 bg-base-100 px-3 pr-[1px] ${
                !githubMutation.isLoading && githubMutation.isSuccess
                  ? "border-success"
                  : ""
              }`}
            >
              <FaGithub size={24} />
              <span className="ml-2">https://github.com/</span>
            </div>
            <input
              value={gitHubPath || ""}
              onChange={(e) =>
                updateToken({
                  gitHubPath: e.target.value,
                })
              }
              type="text"
              placeholder="path/to/the/file"
              className={`input-bordered input join-item w-full border-[1px] border-l-0 border-base-300 bg-base-100 pl-0 focus:outline-none ${
                !githubMutation.isLoading && githubMutation.isSuccess
                  ? "border-success"
                  : ""
              }`}
            />
            <button
              type="button"
              className={`join-item btn ${
                !githubMutation.isLoading && githubMutation.isSuccess
                  ? "btn-success"
                  : ""
              }`}
              onClick={githubImportHandler}
            >
              Add{" "}
              {githubMutation.isLoading && (
                <span className="loading loading-dots loading-sm"></span>
              )}
            </button>
          </div>
          {!githubMutation.isLoading && githubMutation.isError && (
            <p className="mt-4 text-error">
              Error: {githubMutation.error.message}
            </p>
          )}
        </div>
      )}
      {activeTab === 1 && (
        <div className="mt-5 flex flex-col gap-4 shadow-sm">
          <h2 className="font-regular text-xl tracking-tight">Upload file</h2>
          <input
            type="file"
            className={`file-input-bordered file-input w-full focus:outline-none ${
              !fileUploadMutation.isLoading && fileUploadMutation.isSuccess
                ? "input-success"
                : ""
            }`}
            onChange={fileUploadHandler}
          />
          {!fileUploadMutation.isLoading && fileUploadMutation.isError && (
            <p className="mt-4 text-error">
              Error: {fileUploadMutation.error.message}
            </p>
          )}
        </div>
      )}
    </>
  );
}
