import Head from "next/head";
import type { InferGetServerSidePropsType } from "next";
import { type Imports } from "@prisma/client";
import ExportToken from "~/components/TransformToken";
import Link from "next/link";
import RemoveToken from "~/components/RemoveToken";
import { useRouter } from "next/router";
import Transforms from "~/components/Transforms";
import TokenContent from "~/components/TokenContent";
import {
  type GetServerSidePropsContextWithSession,
  withSession,
} from "~/server/withSession";
import { getImportById } from "~/utils/get-import-by-id";

export const getServerSideProps = withSession<{
  token: Imports;
}>(async ({ params, session }: GetServerSidePropsContextWithSession) => {
  const token = await getImportById({
    id: params?.id as string,
    userId: session?.user.id,
  });

  if (!token) {
    return {
      redirect: { destination: "/tokens", permanent: false },
    };
  }

  return {
    props: {
      token: JSON.parse(JSON.stringify(token)) as Imports,
    },
  };
});

export default function Token({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const onDeleteHandler = () => {
    router.push("/tokens").catch((err) => console.log(err));
  };
  return (
    <>
      <Head>
        <title>{token.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex flex-col">
        <header className="mb-2 flex items-center justify-between">
          <h1 className="text-4xl tracking-tight">{token.name}</h1>
          <Link href="/tokens" className="btn-outline btn">
            Back
          </Link>
        </header>
        <div className="text-xl">{token.description}</div>
        <div className="mt-6 flex w-full flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-[50%]">
            <div className="mb-6 rounded-md bg-neutral">
              <h2 className="rounded-t-md border-b-[1px] border-accent p-4 text-xl font-bold tracking-tight text-accent">
                Export config
              </h2>
              <div className="p-4">
                <ExportToken tokens={[token]} />
              </div>
            </div>
            <div className="mb-6 rounded-md bg-neutral">
              <h2 className="rounded-t-md border-b-[1px] border-accent p-4 text-xl font-bold tracking-tight text-accent">
                Transforms
              </h2>
              <div className="p-4">
                <Transforms importId={token.id} />
              </div>
            </div>
            <div className="mb-6 rounded-md bg-neutral">
              <h2 className="rounded-t-md border-b-[1px] border-error p-4 text-xl font-bold tracking-tight text-error">
                Danger - Remove token
              </h2>
              <RemoveToken id={token.id} onDelete={onDeleteHandler} />
            </div>
          </div>
          <div className="w-full xl:w-[50%]">
            <div className="mb-6 rounded-md bg-neutral">
              <h2 className="rounded-t-md border-b-[1px] border-accent p-4 text-xl font-bold tracking-tight text-accent">
                Source
              </h2>
              <div className="p-4 lg:h-[calc(100vh-269px)] lg:overflow-auto">
                <TokenContent body={token.file} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
