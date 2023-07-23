import JSZip from "jszip";
import saveAs from "file-saver";
import { type TokenPlatformFormat } from "~/types/server";
import { getFileExtensionByFormat } from "./get-file-extension-by-format";
import { normalizeTokenFormat } from "./normalize";

export const getZips = (files: TokenPlatformFormat[]) => {
  const zip = new JSZip();
  files.forEach((file) => {
    const extension = getFileExtensionByFormat(file.name);
    if (extension) {
      zip.file(`${normalizeTokenFormat(file.name)}.${extension}`, file.value);
    }
  });

  zip
    .generateAsync({ type: "blob" })
    .then((content) => {
      const newDate = new Date();
      saveAs(
        content,
        `export-${newDate.getFullYear()}${newDate.getMonth()}${newDate.getDate()}${newDate.getHours()}${newDate.getMinutes()}${newDate.getSeconds()}.zip`
      );
    })
    .catch((err) => console.log("Error", err));
};
