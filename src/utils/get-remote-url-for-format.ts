import { getBuildPath } from "./get-build-path";
import { putObject } from "./s3-client";
import fs from "fs";
import { type TSaveTokenInput } from "~/types/server";

export const getRemoteUrlForFormat = async ({
  id,
  format,
}: {
  id: TSaveTokenInput["id"];
  format: TSaveTokenInput["token"]["platforms"][0]["formats"][0];
}): Promise<string | null> => {
  const buildPath = getBuildPath(id);
  const file = fs.readFileSync(`${buildPath}/${format.name}.${format.ext}`);
  let url;
  if (file) {
    const response = await putObject({
      Bucket: process.env.AWS_S3_BUCKET || "",
      Key: `cdn/${id}/${format.name}.${format.ext}`,
      Body: file.toString(),
    });
    if (
      response &&
      process.env.AWS_S3_BUCKET &&
      process.env.AWS_REGION &&
      id &&
      format.name &&
      format.ext
    ) {
      url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/cdn/${id}/${format.name}.${format.ext}`;
    }
    return url || null;
  }
  return null;
};
