import fs from "fs";
import {
  type Token,
  type TokenOutput,
  type PlatformOutput,
  type TokenPlatformFormat,
} from "~/types/server";

export const getTokenOutput = ({
  buildPath,
  token,
}: {
  buildPath: string;
  token: Token;
}) => {
  const output: TokenOutput = {
    namespace: token.namespace,
    platforms: [],
  };
  for (const platform of token.platforms) {
    const platformOutput: PlatformOutput = {
      name: platform.name,
      formats: [],
    };

    fs.readdirSync(buildPath).forEach((file) => {
      const filename = file.split(".")[0];
      if (platform.formats) {
        for (const format of platform.formats) {
          if (filename === `${platform.name}-${format.replace("/", "-")}`) {
            const formatOutput: TokenPlatformFormat = {
              name: format,
              value: fs.readFileSync(`${buildPath}${file}`).toString(),
            };
            if (formatOutput && platformOutput.formats) {
              platformOutput.formats.push(formatOutput);
            } else {
              if (output.error) {
                output.error = `No output for format ${format} was found.`;
              }
            }
          }
        }
      }
    });

    output.platforms?.push(platformOutput);
  }

  return output;
};

export const getErrorOutput = ({
  namespace,
}: {
  namespace: string;
}): TokenOutput => {
  return {
    namespace,
    error: `No token for namespace was found.`,
  };
};
