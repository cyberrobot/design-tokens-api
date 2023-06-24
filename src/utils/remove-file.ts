import fs from "fs";

export const removeFile = (path: string) => {
  fs.rm(path, (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("File removed successfully!");
  });
};
