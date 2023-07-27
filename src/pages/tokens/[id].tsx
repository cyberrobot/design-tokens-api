import Head from 'next/head';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { type FileImport } from '@prisma/client';
import { prisma } from '~/server/db';
import ExportToken from '~/components/ExportToken';
import EndpointDisplay from '~/components/EndpointDisplay';
import { useTokenTransformStore } from '~/stores/use-token-transform';

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
  return (
    <>
      <Head>
        <title>{token.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container min-h-screen flex flex-col px-20 mx-auto">
        <header className="mt-10 mb-6 self-start">
          <h1 className='text-5xl font-bold tracking-tight'>{token.name}</h1>
        </header>
        <div className='text-xl'>{token.description}</div>
        <div className="flex gap-12 w-full mt-4">
          <div className="lg:w-[50%] md:w-full">
            <div className="bg-neutral rounded-md mb-6">
              <h2 className='text-xl font-bold tracking-tight text-accent p-4 rounded-t-md border-b-[1px] border-accent'>Content</h2>
              <pre className="text-sm p-4">{token.file}</pre>
            </div>
          </div>
          <div className="lg:w-[50%] md:w-full">
            <div className="mb-6 bg-neutral rounded-md">
              <h2 className='text-xl font-bold tracking-tight text-accent p-4 rounded-t-md border-b-[1px] border-accent'>Export</h2>
              <div className="p-4">
                <ExportToken tokens={[token]} />
              </div>
            </div>
            <div className="bg-neutral rounded-md">
              <h2 className='text-xl font-bold tracking-tight text-accent p-4 rounded-t-md border-b-[1px] border-accent'>API</h2>
              <EndpointDisplay query={query} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
