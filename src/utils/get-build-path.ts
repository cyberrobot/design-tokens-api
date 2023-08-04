import { sdBuildFolder } from "~/constants";
/**
 * Get build path for transform
 * @param id transform id
 * @todo add version to build path
 * @returns
 */
export const getBuildPath = (id: string) => {
  return `${sdBuildFolder}${id}/`;
};
