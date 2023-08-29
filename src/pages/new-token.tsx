import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import TokenContent from "~/components/TokenContent";
import TokenImportSource from "~/components/TokenImportSource";
import { withSession } from "~/server/withSession";
import { useTokenImportStore } from "~/stores/use-token-import";
import { api } from "~/utils/api";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = withSession(async () => {
  return { props: {} };
});

function NewToken() {
  const { updateToken, ...token } = useTokenImportStore((state) => state);
  const router = useRouter();
  const mutation = api.import.save.useMutation();
  const importHandler = () => {
    if (!token.name || !token.content) return;
    mutation.mutate({
      name: token.name,
      description: token.description,
      file: token.content,
    });
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      router.push("/tokens").catch((err) => console.log(err));
    }

    return () => {
      updateToken({
        name: "",
        description: "",
        content: "",
      });
    };
  }, [mutation.isSuccess, router, updateToken]);

  return (
    <>
      <Head>
        <title>Import Design Tokens</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex flex-col">
        <div className="mb-6 self-start">
          <h1 className="text-5xl font-bold tracking-tight">New token</h1>
        </div>
        <div className="flex w-full gap-6">
          <div className="config md:w-full lg:w-[50%]">
            <div>
              <div className="mb-4 flex flex-col">
                <label htmlFor="token-name">Name</label>
                <input
                  id="token-name"
                  type="text"
                  name="token.name"
                  className="input-bordered input mt-2 w-full bg-base-content text-base-300"
                  placeholder="Brand A - Color"
                  onChange={(e) => updateToken({ name: e.target.value })}
                />
              </div>
              <div className="mb-4 flex flex-col">
                <label>Description</label>
                <textarea
                  name="token.description"
                  className="input-bordered input mt-2 h-24 max-h-24 min-h-[96px] w-full bg-base-content py-2 text-base-300"
                  placeholder="Color styles for Brand A. Do not override!"
                  onChange={(e) => updateToken({ description: e.target.value })}
                />
              </div>
            </div>
            <div className="mb-6 mt-10 rounded-md bg-neutral">
              <h2 className="rounded-t-md border-b-[1px] border-accent p-4 text-xl font-bold tracking-tight text-accent">
                Source
              </h2>
              <div className="p-4 pt-8">
                <TokenImportSource />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="btn-primary btn-outline btn"
                onClick={() => importHandler()}
              >
                Save{" "}
                {mutation.isLoading && (
                  <span className="loading loading-dots loading-sm"></span>
                )}
              </button>
              <Link href="/tokens" className="btn-outline btn">
                Back
              </Link>
            </div>
          </div>
          {token.content && (
            <div className="token-preview hidden md:w-full lg:block lg:w-[50%]">
              <div className="mb-6 rounded-md bg-neutral">
                <h2 className="rounded-t-md border-b-[1px] border-accent p-4 text-xl font-bold tracking-tight text-accent">
                  Preview
                </h2>
                <div className="p-4">
                  <TokenContent body={token.content} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NewToken;
