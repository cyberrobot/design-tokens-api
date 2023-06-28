import { type DesignToken } from "style-dictionary/types/DesignToken";
import { getConfig } from "./config";
import StyleDictionary from "style-dictionary";
import { type Platforms } from "~/server/api/routers/get-token";

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
  console.log("SD config", JSON.stringify(config));
  const styleDictionaryExtended = StyleDictionary.extend(config);
  styleDictionaryExtended.buildAllPlatforms();
  console.log("File generated successfully!");
};
