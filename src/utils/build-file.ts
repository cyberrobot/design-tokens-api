import { type DesignToken } from "style-dictionary/types/DesignToken";
import { getConfig } from "./config";
import StyleDictionary from "style-dictionary";
import { type Platforms } from "~/types/server";

export const buildTokens = ({
  token,
  platforms,
  buildPath,
}: {
  token: DesignToken;
  platforms: Platforms;
  buildPath: string;
}) => {
  const config = getConfig({
    token,
    platforms,
    buildPath,
  });
  const styleDictionaryExtended = StyleDictionary.extend(config);
  styleDictionaryExtended.buildAllPlatforms();
  console.log("File generated successfully!");
};
