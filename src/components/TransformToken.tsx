import { type Imports } from "@prisma/client";
import AddPlatform from "./AddPlatform";
import ListPlatforms from "./ListPlatforms";
import { useEffect, useState } from "react";
import { usePlatformStore } from "~/stores/use-platform";
import { api } from "~/utils/api";
import ListTokens from "./ListTokens";
import { useTokenTransformStore } from "~/stores/use-token-transform";
import { type TransformTokenResponse } from "~/types/server";
import { useTransformsStore } from "~/stores/use-transforms";

function ExportToken({
  tokens,
  showTokens = false,
}: {
  tokens: Imports[];
  showTokens?: boolean;
}) {
  const id = tokens[0]?.id || "";
  const platforms = usePlatformStore((state) => state.platforms);
  const { updateState, ...input } = useTokenTransformStore();
  const [namespace, setNamespace] = useState("");
  const transformMutation = api.tokens.transformImport.useMutation();
  const saveMutation = api.transforms.saveTransform.useMutation();
  const setTransformId = useTransformsStore((state) => state.setTransformId);
  const saveMutationHandler = (response: TransformTokenResponse) => {
    const token = response.tokens[0];
    if (token) {
      saveMutation
        .mutateAsync({
          id: response.id,
          token: {
            namespace: token.namespace,
            platforms: token.platforms?.map((platform) => ({
              name: platform.name,
              formats: platform.formats,
            })),
          },
        })
        .then((response) => {
          setTransformId(response?.transformId || "");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    updateState({
      id,
      tokens: [
        {
          namespace,
          platforms,
        },
      ],
    });
  }, [id, namespace, platforms, updateState]);

  const transformHandler = () => {
    if (!platforms.length) return;
    transformMutation
      .mutateAsync(input)
      .then((response) => {
        if (!response) return;
        saveMutationHandler(response);
      })
      .catch((error) => {
        // Handle any errors that occurred during the Promise execution
        console.error(error);
      });
  };

  return (
    <div>
      {showTokens && (
        <div className="my-4">
          <ListTokens tokens={tokens} />
        </div>
      )}
      {tokens.length > 1 && (
        <div className="mt-4">Multiple tokens will be merged.</div>
      )}
      {showTokens && <div className="divider"></div>}
      <label>Namespace</label>
      <div className="join my-3 gap-6">
        <input
          type="text"
          name="token.namespace"
          className="input-bordered input"
          placeholder="color.button.primary"
          onChange={(e) => setNamespace(e.target.value)}
        />
        <span>
          Namespace is a dot notated path to target a nested value. Without it,
          the entire token will be transformed.
        </span>
      </div>
      <div className="mb-8 rounded-md">
        <ListPlatforms />
      </div>
      <AddPlatform />
      <div className="modal-action">
        <button
          className="btn-primary btn-outline btn"
          onClick={transformHandler}
        >
          Transform{" "}
          {(transformMutation.isLoading || saveMutation.isLoading) && (
            <span className="loading loading-dots loading-sm"></span>
          )}
        </button>
      </div>
    </div>
  );
}

export default ExportToken;
