import {
  type DesignTokens,
  type Config,
  type Platform as SDPlatform,
} from "style-dictionary";
import { type Platform, type Platforms } from "~/types/server";

const getPlatform = ({
  config,
  buildPath,
}: {
  config: Platform;
  buildPath: string;
}): SDPlatform => {
  return {
    ...(config.transformGroup && { transformGroup: config.transformGroup }),
    ...(config.transforms && { transforms: config.transforms }),
    buildPath: buildPath,
    files: config.formats?.map((format) => {
      return {
        destination: `${config.name}-${format.replace("/", "-")}.tokens`,
        format: format,
        options: {
          showFileHeader: false,
        },
      };
    }),
  };
};

export const getConfig = ({
  token,
  platforms,
  buildPath,
}: {
  token: DesignTokens;
  platforms: Platforms;
  buildPath: string;
}): Config => {
  const result: Config = {
    tokens: token,
    platforms: {},
  };

  for (const platform of platforms) {
    if (platform) {
      result.platforms[platform.name] = getPlatform({
        config: platform,
        buildPath,
      });
    }
  }

  return result;
};
