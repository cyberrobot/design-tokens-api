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
        destination: "scss.scss",
        format: "scss/variables",
      },
    ],
  },
  css: {
    transformGroup: "web",
    files: [
      {
        destination: "css.css",
        format: "css/variables",
      },
    ],
  },
};

const getPlatform = ({
  config,
  buildPath,
}: {
  config: Platform;
  buildPath: string;
}) => {
  return {
    transformGroup: config.transformGroup,
    buildPath: buildPath,
    files: config.files?.map((file) => {
      return {
        destination: file.destination,
        format: file.format,
        options: {
          showFileHeader: false,
        },
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
        buildPath,
      });
    }
  }

  return result;
};
