import { sdBuildFolder } from "~/constants";
/**
 * Get build path for transform
 * @param id transform id
 * @returns
 */
export const getBuildPath = (id: string) => {
  return `${sdBuildFolder}${id}/`;
};
