import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { type Imports } from '@prisma/client';
import { prisma } from '~/server/db';
import Link from 'next/link';
import { api } from '~/utils/api';
import Transform from '~/components/Transform';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps<{
  token: Imports
}> = async ({ params }) => {
  const token = await prisma.imports.findFirst({
    where: {
      id: params?.id as string,
    },
  });

  return {
    props: {
      token: JSON.parse(JSON.stringify(token)) as Imports
    }
  }
}

export default function Transforms({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [currentId, setCurrentId] = useState<string>()
  const transforms = api.transforms.getTransforms.useQuery({ importId: token.id })
  const mutation = api.transforms.removeTransform.useMutation({
    onMutate(variables) {
      setCurrentId(variables.id);
    },
  });
  const deleteHandler = (id: string) => {
    mutation.mutateAsync({ id }).then(() => {
      transforms.refetch().catch(err => console.log(err));
    }).catch(err => console.log(err));
  }
  return (
    <>
      <Head>
        <title>{token.name} token transforms</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container min-h-screen flex flex-col px-20 mx-auto">
        <header className="mt-10 mb-6 flex justify-between items-center">
          <h1 className='text-5xl font-bold tracking-tight'>Transforms: {token.name}</h1>
          <Link href={`/tokens/${token.id}`} className='btn btn-outline'>Back</Link>
        </header>
        <div className="flex flex-col w-full mt-4">
          {transforms.data?.map(transform => {
            return (
              <div className="w-full mb-6" key={`transform-${transform.id}`}>
                <div className="bg-neutral rounded-md">
                  <div className="flex justify-between items-center rounded-t-md border-b-[1px] border-accent">
                    <h2 className='text-xl font-bold tracking-tight text-accent p-4'>{transform.id}</h2>
                    <button className="btn btn-outline btn-error btn-sm mr-4" onClick={() => deleteHandler(transform.id)}>Remove {mutation.isLoading && currentId === transform.id && <span className="loading loading-dots loading-sm"></span>}</button>
                  </div>
                  <div className="p-4">
                    <div className="text-gray-400 mb-2">Created: {transform.createdAt.toLocaleDateString()} - {transform.createdAt.toLocaleTimeString()}</div>
                    <Transform transform={transform} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
