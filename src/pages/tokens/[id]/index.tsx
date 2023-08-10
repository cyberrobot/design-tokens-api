import Head from 'next/head';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { type Imports } from '@prisma/client';
import { prisma } from '~/server/db';
import ExportToken from '~/components/TransformToken';
import Link from 'next/link';
import RemoveToken from '~/components/RemoveToken';
import { useRouter } from 'next/router';
import Transforms from '~/components/Transforms';
import TokenContent from '~/components/TokenContent';

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

export default function Token({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const onDeleteHandler = () => {
    router.push('/tokens').catch(err => console.log(err));
  }
  return (
    <>
      <Head>
        <title>{token.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container min-h-screen flex flex-col px-20 mx-auto">
        <header className="mt-10 mb-6 flex justify-between items-center">
          <h1 className='text-5xl font-bold tracking-tight'>{token.name}</h1>
          <Link href="/tokens" className='btn btn-outline'>Back</Link>
        </header>
        <div className='text-xl'>{token.description}</div>
        <div className="flex flex-col xl:flex-row gap-12 w-full mt-4">
          <div className="w-full xl:w-[50%]">
            <div className="mb-6 bg-neutral rounded-md">
              <h2 className='text-xl font-bold tracking-tight text-accent p-4 rounded-t-md border-b-[1px] border-accent'>Export config</h2>
              <div className="p-4">
                <ExportToken tokens={[token]} />
              </div>
            </div>
            <div className="bg-neutral rounded-md mb-6">
              <h2 className='text-xl font-bold tracking-tight text-accent p-4 rounded-t-md border-b-[1px] border-accent'>Transforms</h2>
              <div className="p-4">
                <Transforms importId={token.id} />
              </div>
            </div>
            <div className="bg-neutral rounded-md mb-6">
              <h2 className='text-xl font-bold tracking-tight text-error p-4 rounded-t-md border-b-[1px] border-error'>Danger - Remove token</h2>
              <RemoveToken id={token.id} onDelete={onDeleteHandler} />
            </div>
          </div>
          <div className="w-full xl:w-[50%]">
            <div className="bg-neutral rounded-md mb-6">
              <h2 className='text-xl font-bold tracking-tight text-accent p-4 rounded-t-md border-b-[1px] border-accent'>Source</h2>
              <div className="p-4">
                <TokenContent body={token.file} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
