import {
  type DesignTokens,
  type Config,
  type Platform,
} from "style-dictionary";

type PlatformConfig = {
  transformGroup: string;
  files: [
    {
      destination: string;
      format: string;
    }
  ];
};

const platforms: Record<string, PlatformConfig> = {
  scss: {
    transformGroup: "scss",
    files: [
      {
        destination: `scss.scss`,
        format: "scss/variables",
      },
    ],
  },
};

const getPlatform = ({
  config,
  id,
  buildPath,
}: {
  config: Platform;
  id: string;
  buildPath: string;
}) => {
  return {
    transformGroup: config.transformGroup,
    buildPath: buildPath,
    files: config.files?.map((file) => {
      const destination = file.destination?.split(".");
      const fileName = `${destination[0] as string}-${id}.${
        destination[1] as string
      }`;
      return {
        destination: fileName,
        format: file.format,
      };
    }),
  };
};

export const getConfig = ({
  token,
  id,
  transforms,
  buildPath,
}: {
  token: DesignTokens;
  id: string;
  transforms: string[];
  buildPath: string;
}): Config => {
  const result: Config = {
    tokens: token,
    platforms: {},
  };

  for (const transform of transforms) {
    if (platforms[transform]) {
      result.platforms[transform] = getPlatform({
        config: platforms[transform] as Platform,
        id,
        buildPath,
      });
    }
  }

  return result;
};
