import Head from 'next/head';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { type FileImport } from '@prisma/client';
import { prisma } from '~/server/db';
import ExportToken from '~/components/ExportToken';
import EndpointDisplay from '~/components/EndpointDisplay';
import { useTokenTransformStore } from '~/stores/use-token-transform';
import Link from 'next/link';
import RemoveToken from '~/components/RemoveToken';
import { useRouter } from 'next/router';

export const getServerSideProps: GetServerSideProps<{
  token: FileImport
}> = async ({ params }) => {
  const token = await prisma.fileImport.findFirst({
    where: {
      id: params?.id as string,
    },
  });

  return {
    props: {
      token: JSON.parse(JSON.stringify(token)) as FileImport
    }
  }
}

export default function Token({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const query = useTokenTransformStore((state) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { updateState, ...input } = state;
    return input;
  });
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
              <h2 className='text-xl font-bold tracking-tight text-accent p-4 rounded-t-md border-b-[1px] border-accent'>API endpoint example</h2>
              <EndpointDisplay query={query} />
            </div>
            <div className="bg-neutral rounded-md mb-6">
              <h2 className='text-xl font-bold tracking-tight text-red-500 p-4 rounded-t-md border-b-[1px] border-red-500'>Danger - Remove token</h2>
              <RemoveToken id={token.id} onDelete={onDeleteHandler} />
            </div>
          </div>
          <div className="w-full xl:w-[50%]">
            <div className="bg-neutral rounded-md mb-6">
              <h2 className='text-xl font-bold tracking-tight text-accent p-4 rounded-t-md border-b-[1px] border-accent'>Source</h2>
              <pre className="text-sm p-4">{token.file}</pre>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
