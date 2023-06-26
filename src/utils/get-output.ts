import fs from "fs";
import { type Output, type Transform } from "~/server/api/routers/get-token";

export const getOutput = ({
  id,
  buildPath,
  transforms,
  namespace,
}: {
  id: string;
  buildPath: string;
  transforms: Transform[];
  namespace: string;
}) => {
  const output: Output = {
    namespace,
    transforms: {},
  };
  for (const transform of transforms) {
    fs.readdirSync(buildPath).forEach((file) => {
      if (file.includes(`${transform}-${id}`)) {
        const transformOutput = fs
          .readFileSync(`${buildPath}${file}`)
          .toString();
        if (transformOutput) {
          if (output.transforms) {
            output.transforms[transform] = transformOutput;
          }
        } else {
          if (output.transforms) {
            output.transforms[
              transform
            ] = `No output for transform ${transform} was found.`;
          }
        }
      }
    });
  }

  return output;
};

export const getErrorOutput = ({
  namespace,
}: {
  namespace: string;
  id: string;
}): Output => {
  return {
    namespace,
    error: `No token for namespace was found.`,
  };
};
