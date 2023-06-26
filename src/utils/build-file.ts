import { type DesignToken } from "style-dictionary/types/DesignToken";
import { getConfig } from "./config";
import StyleDictionary from "style-dictionary";

export const buildToken = ({
  token,
  id,
  transforms,
  buildPath,
}: {
  token: DesignToken;
  id: string;
  transforms: string[];
  buildPath: string;
}) => {
  const config = getConfig({
    token,
    id,
    transforms,
    buildPath,
  });
  const styleDictionaryExtended = StyleDictionary.extend(config);
  styleDictionaryExtended.buildAllPlatforms();
  console.log("File generated successfully!");
};
