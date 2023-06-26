import fs from "fs";

export const removeFiles = (path: string) => {
  try {
    fs.rmdirSync(path, { recursive: true });
    console.log("File removed successfully!");
  } catch (error) {
    console.error(error);
  }
};
