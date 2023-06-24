import { type DesignTokens, type Config } from "style-dictionary";

export const getConfig = ({
  token,
  filename,
  path,
}: {
  token: DesignTokens;
  filename: string;
  path: string;
}): Config => ({
  tokens: token,
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: path,
      files: [
        {
          destination: filename,
          format: "scss/variables",
        },
      ],
    },
    // ...
  },
});
