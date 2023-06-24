import { type DesignToken } from "style-dictionary/types/DesignToken";
import { getConfig } from "./config";
import StyleDictionary from "style-dictionary";

export const buildFile = ({
  token,
  id,
}: {
  token: DesignToken;
  id: string;
}) => {
  const buildPath = "build/";
  const filename = `build/variables-${id}.scss`;
  const config = getConfig({
    token,
    filename,
    path: buildPath,
  });
  const styleDictionaryExtended = StyleDictionary.extend(config);
  styleDictionaryExtended.buildAllPlatforms();
  console.log("File generated successfully!");
  return buildPath + filename;
};
