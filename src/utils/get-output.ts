import fs from "fs";

export const getSuccessOutput = ({
  path,
  namespace,
  id,
}: {
  path: string;
  namespace: string;
  id: string;
}) => {
  const output = fs.readFileSync(path).toJSON();
  return {
    namespace,
    id,
    output: JSON.stringify(output),
  };
};

export const getErrorOutput = ({
  namespace,
  id,
}: {
  namespace: string;
  id: string;
}) => {
  return {
    namespace,
    id,
    output: `No token for namespace was found.`,
  };
};
