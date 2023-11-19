import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import TokenContent from "~/components/TokenContent";
import TokenImportSource from "~/components/TokenImportSource";
import { withSession } from "~/server/withSession";
import { useTokenImportStore } from "~/stores/use-token-import";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { type TImportToken } from "~/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImportTokenSchema } from "~/schemas/server";
import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = withSession(async () => {
  return { props: {} };
});

function NewToken() {
  const { updateToken, ...token } = useTokenImportStore((state) => state);
  const router = useRouter();
  const mutation = api.import.save.useMutation();
  const importSubmit = (fields: TImportToken) => {
    mutation
      .mutateAsync(fields)
      .then(() => {
        router.push("/tokens").catch(console.error);
        reset();
        updateToken({
          file: "",
        });
      })
      .catch(console.error);
  };
  const handleImportSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    void handleSubmit(importSubmit)(e);
  };
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<TImportToken>({
    resolver: zodResolver(ImportTokenSchema),
  });

  useEffect(() => {
    setValue("file", token.file);
    clearErrors("file");
  }, [setValue, clearErrors, token.file]);

  // useEffect(() => {
  //   if (mutation.isSuccess) {
  //     router.push("/tokens").catch((err) => console.log(err));
  //   }

  //   return () => {
  //     updateToken({
  //       name: "",
  //       description: "",
  //       file: "",
  //     });
  //   };
  // }, [mutation.isSuccess, router, updateToken]);

  return (
    <>
      <Head>
        <title>Import Design Tokens</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-10">
          <div
            className={`config ${
              token.file ? "flex-grow basis-[500px]" : "w-[500px]"
            }`}
          >
            <h1 className="mb-6 text-4xl tracking-tight">New token</h1>
            <form onSubmit={handleImportSubmit}>
              <div className="mb-4 flex flex-col">
                <label htmlFor="token-name">
                  Name
                  <input
                    id="token-name"
                    type="text"
                    className="input-bordered input mt-2 w-full bg-base-content text-base-300"
                    placeholder="Brand A - Color"
                    {...register("name")}
                  />
                </label>
                {errors.name && (
                  <div className="mt-1 text-error">{errors.name.message}</div>
                )}
              </div>
              <div className="mb-4 flex flex-col">
                <label>
                  Description
                  <textarea
                    className="min-h-24 input-bordered input mt-2 h-24 w-full bg-base-content py-2 text-base-300"
                    placeholder="Color styles for Brand A. Do not override!"
                    {...register("description")}
                  />
                </label>
              </div>
              <div className="my-6 rounded-md bg-neutral">
                <h2 className="rounded-t-md border-b-[1px] border-accent p-4 text-xl font-bold tracking-tight text-accent">
                  Source
                </h2>
                <div className="p-4 pt-8">
                  <TokenImportSource />
                  <input type="hidden" {...register("file")} />
                  {errors.file && (
                    <div className="text-error">{errors.file.message}</div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button className="btn-primary btn-outline btn" type="submit">
                  Save{" "}
                  {mutation.isLoading && (
                    <span className="loading loading-dots loading-sm"></span>
                  )}
                </button>
                <Link href="/tokens" className="btn-outline btn">
                  Back
                </Link>
              </div>
            </form>
          </div>
          {token.file && (
            <div className="token-preview grow-[999] basis-0 [min-inline-size:50%]">
              <div className="mb-6 rounded-md bg-neutral">
                <h2 className="rounded-t-md border-b-[1px] border-accent p-4 text-xl font-bold tracking-tight text-accent">
                  Preview
                </h2>
                <div className="p-4 lg:h-[calc(100vh-189px)] lg:overflow-auto">
                  <TokenContent body={token.file} />
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
