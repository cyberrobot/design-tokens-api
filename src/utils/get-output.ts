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
      // Filename - ".tokens" length
      const fileArray = file.split(".");
      const filename = fileArray.slice(0, fileArray.length - 1).join(".");
      const ext = fileArray[fileArray.length - 1];
      if (platform.formats && ext) {
        for (const format of platform.formats) {
          if (filename === `${platform.name}-${format.replaceAll("/", "-")}`) {
            const fileString = fs
              .readFileSync(`${buildPath}/${file}`)
              .toString();
            const formatOutput: TokenPlatformFormat = {
              name: filename,
              ext: ext || "tokens",
              value: fileString,
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
  namespace?: string;
}): TokenOutput => {
  return {
    ...(namespace && { namespace }),
    platforms: [],
    error: `No token for namespace was found.`,
  };
};
