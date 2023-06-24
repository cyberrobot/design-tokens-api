import fs from "fs";

export const getResponse = ({
  path,
  namespace,
  id,
}: {
  path: string;
  namespace: string;
  id: string;
}) => {
  const output = fs.readFileSync(path).toString();
  return {
    namespace,
    id,
    output,
    success: true,
  };
};
