import { type Import } from '@prisma/client';
import AddPlatform from './AddPlatform';
import ListPlatforms from './ListPlatforms';
import { useEffect, useState } from 'react';
import { usePlatformStore } from '~/stores/use-platform';
import { api } from '~/utils/api';
import ListTokens from './ListTokens';
import { useTokenTransformStore } from '~/stores/use-token-transform';
import { type TransformTokenResponse } from '~/types/server';

function ExportToken({ tokens, showTokens = false }: { tokens: Import[], showTokens?: boolean }) {
  const id = tokens[0]?.id || '';
  const platforms = usePlatformStore((state) => state.platforms);
  const { updateState, ...input } = useTokenTransformStore();
  const [namespace, setNamespace] = useState('')
  const transformMutation = api.tokens.transformToken.useMutation();
  const saveMutation = api.tokens.saveToken.useMutation();
  const saveMutationHandler = (tokens: TransformTokenResponse['tokens']) => {
    saveMutation.mutate({
      tokens: tokens.map(token => ({
        namespace: token.namespace,
        platforms: token.platforms?.map(platform => ({
          name: platform.name,
          formats: platform.formats,
        }))
      }))
    })
  }

  useEffect(() => {
    updateState({
      id,
      tokens: [{
        namespace,
        platforms
      }]
    });
  }, [id, namespace, platforms, updateState])

  const transformHandler = () => {
    if (!platforms.length) return;
    transformMutation.mutateAsync(input).then(response => {
      if (!response) return;
      saveMutationHandler(response?.tokens)
    }).catch((error) => {
      // Handle any errors that occurred during the Promise execution
      console.error(error);
    });
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
        <button className="btn btn-primary btn-outline" onClick={transformHandler}>Transform</button>
      </div>
    </div>
  )
}

export default ExportToken