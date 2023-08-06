import { fileExtensions } from "~/constants";

export const getFileExtensionByFormat = (format: string) => {
  return fileExtensions[format];
};
