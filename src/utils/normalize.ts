import { type Format } from "~/types/server";

export const normalizeTokenFormat = (format: Format) => {
  const regex = new RegExp("[/|.]", "g");
  return format.replaceAll(regex, "-");
};
