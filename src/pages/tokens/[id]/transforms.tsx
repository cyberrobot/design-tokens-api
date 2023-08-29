import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { type Imports } from "@prisma/client";
import { prisma } from "~/server/db";
import Link from "next/link";
import { api } from "~/utils/api";
import Transform from "~/components/Transform";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps<{
  token: Imports;
}> = async ({ params }) => {
  const token = await prisma.imports.findFirst({
    where: {
      id: params?.id as string,
    },
  });

  return {
    props: {
      token: JSON.parse(JSON.stringify(token)) as Imports,
    },
  };
};

export default function Transforms({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [currentId, setCurrentId] = useState<string>();
  const transforms = api.transforms.getTransforms.useQuery({
    importId: token.id,
  });
  const mutation = api.transforms.removeTransform.useMutation({
    onMutate(variables) {
      setCurrentId(variables.id);
    },
  });
  const deleteHandler = (id: string) => {
    mutation
      .mutateAsync({ id })
      .then(() => {
        transforms.refetch().catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Head>
        <title>{token.name} token transforms</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex flex-col">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-5xl font-bold tracking-tight">
            Transforms: {token.name}
          </h1>
          <Link href={`/tokens/${token.id}`} className="btn-outline btn">
            Back
          </Link>
        </header>
        <div className="mt-4 flex w-full flex-col">
          {transforms.data?.map((transform) => {
            return (
              <div className="mb-6 w-full" key={`transform-${transform.id}`}>
                <div className="rounded-md bg-neutral">
                  <div className="flex items-center justify-between rounded-t-md border-b-[1px] border-accent">
                    <h2 className="p-4 text-xl font-bold tracking-tight text-accent">
                      {transform.id}
                    </h2>
                    <button
                      className="btn-outline btn-error btn-sm btn mr-4"
                      onClick={() => deleteHandler(transform.id)}
                    >
                      Remove{" "}
                      {mutation.isLoading && currentId === transform.id && (
                        <span className="loading loading-dots loading-sm"></span>
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="mb-2 text-gray-400">
                      Created: {transform.createdAt.toLocaleDateString()} -{" "}
                      {transform.createdAt.toLocaleTimeString()}
                    </div>
                    <Transform transform={transform} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
