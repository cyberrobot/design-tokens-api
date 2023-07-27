import { type FileImport } from '@prisma/client';
import AddPlatform from './AddPlatform';
import ListPlatforms from './ListPlatforms';
import { useEffect, useState } from 'react';
import { usePlatformStore } from '~/stores/use-platform';
import { api } from '~/utils/api';
import { getZips } from '~/utils/get-zips';
import ListTokens from './ListTokens';
import { useTokenTransformStore } from '~/stores/use-token-transform';

function ExportToken({ tokens, showTokens = false }: { tokens: FileImport[], showTokens?: boolean }) {
  const id = tokens[0]?.id || '';
  const platforms = usePlatformStore((state) => state.platforms);
  const { updateState, ...input } = useTokenTransformStore();
  const [namespace, setNamespace] = useState('')
  const query = api.tokens.getToken.useQuery(input, {
    enabled: false
  });

  useEffect(() => {
    updateState({
      id,
      tokens: [{
        namespace,
        platforms
      }]
    });
  }, [id, namespace, platforms, updateState])

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
    <div>
      {showTokens && <div className="my-4"><ListTokens tokens={tokens} /></div>}
      {tokens.length > 1 && <div className="mt-4">Multiple tokens will be merged.</div>}
      {showTokens && <div className="divider"></div>}
      <label>Namespace</label>
      <div className="join gap-6 my-3">
        <input type="text" name="token.namespace" className="input input-bordered" placeholder="color.button.primary" onChange={e => setNamespace(e.target.value)} />
        <span>Namespace is a dot notated path to target a nested value. Without it, the entire token will be transformed.</span>
      </div>
      <div className="mb-8 rounded-md">
        <ListPlatforms />
      </div>
      <AddPlatform />
      <div className="modal-action">
        <button className="btn btn-primary" onClick={exportHandler}>Export</button>
      </div>
    </div>
  )
}

export default ExportToken