import { type FileImport } from '@prisma/client';
import AddPlatform from './AddPlatform';
import ListPlatforms from './ListPlatforms';
import { useEffect, useRef, useState } from 'react';
import { usePlatformStore } from '~/stores/use-platform';
import { api } from '~/utils/api';
import { type Token } from '~/types/server';
import { getZips } from '~/utils/get-zips';
import ListTokens from './ListTokens';

function AddToken({ tokens }: { tokens: FileImport[] }) {
  const namespaceRef = useRef<HTMLInputElement>(null);
  const platforms = usePlatformStore((state) => state.platforms);
  const [input, setInput] = useState<{
    id: string;
    tokens: Token[]
  }>({
    id: '',
    tokens: []
  })

  const query = api.tokens.getToken.useQuery(input, {
    enabled: false
  });

  useEffect(() => {
    setInput({
      id: tokens[0]?.id || '',
      tokens: [{
        namespace: namespaceRef.current?.value,
        platforms
      }]
    });
  }, [namespaceRef.current?.value, platforms, tokens])

  useEffect(() => {
    if (query.data) {
      query.data.tokens.forEach(token => {
        if (token.platforms) {
          token.platforms.forEach(platform => {
            if (platform.formats) {
              getZips(platform.formats)
            }
          })
        }
      })
    }
  }, [query.data])



  const exportHandler = () => {
    const refetchFn = async () => {
      await query.refetch();
    };
    if (!platforms.length) return;
    refetchFn().catch((err) => { console.log(err) });
  }

  return (
    <main>
      <div className="my-4"><ListTokens tokens={tokens} /></div>
      {tokens.length > 1 && <div className="mt-4">Multiple tokens will be merged.</div>}
      <div className="divider"></div>
      <label>Namespace</label>
      <div className="join gap-6 my-3">
        <input ref={namespaceRef} type="text" name="token.namespace" className="input input-bordered" placeholder="color.button.primary" />
        <span>Namespace is a dot notated path to target a nested value. Without it, the entire token will be transformed.</span>
      </div>
      <div className="mb-8 rounded-md">
        <ListPlatforms />
      </div>
      <AddPlatform />
      <div className="modal-action">
        <button className="btn btn-primary" onClick={exportHandler}>Export</button>
      </div>
    </main>
  )
}

export default AddToken