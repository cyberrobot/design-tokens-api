import { useEffect } from 'react';
import { api } from '~/utils/api';

export default function RemoveToken({ id, onDelete }: { id: string, onDelete?: () => void }) {
  const mutation = api.tokens.removeToken.useMutation();
  const deleteHandler = (id: string) => {
    mutation.mutate({ id });
  }
  useEffect(() => {
    if (onDelete && mutation.isSuccess) {
      onDelete();
    }
  }, [mutation.isSuccess, onDelete])

  return (
    <div className="p-4">
      The token will be deleted permanently. This action cannot be undone.
      <div className="flex mt-4 justify-end">
        <button className="btn btn-outline btn-error" onClick={() => deleteHandler(id)}>Remove {mutation.isLoading && <span className="loading loading-dots loading-sm"></span>}</button>
      </div>
    </div>
  )
}
