import Head from "next/head";
import { host } from "~/constants";
import { api } from "~/utils/api";

export default function Home() {
  const mutation = api.tokens.transformImport.useMutation();

  const tokenRequestHandler = () => {
    mutation.mutate({
      id: "cljihsyj900004kqy1z0ksu7c",
      tokens: [
        {
          platforms: [
            {
              name: "css",
              transformGroup: "css",
              formats: ["css/variables"],
            },
          ],
        },
        {
          platforms: [
            {
              name: "ES6",
              transformGroup: "js",
              formats: ["javascript/es6", "typescript/es6-declarations"],
            },
          ],
        },
      ],
    });
  };

  return (
    <>
      <Head>
        <title>Example request token</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Example request token
          </h1>
          <div className="w-[1000px]">
            <div className="join mb-4 w-full items-center gap-3 bg-white p-3">
              <pre className="w-[870px] overflow-x-hidden text-ellipsis text-sm">
                <code>
                  {host}
                  /api/trpc/token.get?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22id%22%3A%22cljihsyj900004kqy1z0ksu7c%22%2C%22tokens%22%3A%5B%7B%22platforms%22%3A%5B%7B%22name%22%3A%22css%22%2C%22transformGroup%22%3A%22css%22%2C%22formats%22%3A%5B%22css%2Fvariables%22%5D%7D%5D%7D%2C%7B%22platforms%22%3A%5B%7B%22name%22%3A%22ES6%22%2C%22transformGroup%22%3A%22js%22%2C%22formats%22%3A%5B%22javascript%2Fes6%22%2C%22typescript%2Fes6-declarations%22%5D%7D%5D%7D%5D%7D%7D%7D
                </code>
              </pre>
              <button
                className="btn-primary btn-sm btn"
                onClick={tokenRequestHandler}
              >
                Request
              </button>
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Request body</h3>
            <div className="mb-3 rounded-md bg-white p-3 pt-0 text-sm">
              <pre>
                {`
HTTP/1.0 200 OK
Content-Type: application/json
{
  id: 'cljihsyj900004kqy1z0ksu7c',
  tokens: [
    {
      platforms: [
        {
          name: 'css',
          transformGroup: 'css',
          formats: ['css/variables']
        }
      ]
    },
    {
      platforms: [
        {
          name: 'ES6',
          transformGroup: 'js',
          formats: ['javascript/es6', 'typescript/es6-declarations']
        }
      ]
    }
  ]
}
`}
              </pre>
            </div>
            {mutation.data && (
              <div>
                <h3 className="mb-3 text-xl font-bold text-white">Response</h3>
                <pre className="w-[1000px] overflow-auto rounded-md bg-white p-3 pt-0 text-sm">
                  <code className="w-full">
                    {`
HTTP/1.0 200 OK
Content-Type: application/json
${JSON.stringify(mutation.data, null, 2)}
`}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
