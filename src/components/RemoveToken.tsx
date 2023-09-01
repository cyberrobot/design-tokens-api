import { useEffect } from "react";
import { api } from "~/utils/api";

export default function RemoveToken({
  id,
  onDelete,
}: {
  id: string;
  onDelete?: () => void;
}) {
  const mutation = api.tokens.removeImport.useMutation();
  const deleteHandler = (id: string) => {
    mutation.mutate({ id });
  };
  useEffect(() => {
    if (onDelete && mutation.isSuccess) {
      onDelete();
    }
  }, [mutation.isSuccess, onDelete]);

  return (
    <div className="p-4">
      The token will be deleted permanently. This action cannot be undone.
      <div className="mt-4 flex justify-end">
        <button
          className="btn-outline btn-error btn"
          onClick={() => deleteHandler(id)}
        >
          Remove{" "}
          {mutation.isLoading && (
            <span className="loading loading-dots loading-sm"></span>
          )}
        </button>
      </div>
    </div>
  );
}
