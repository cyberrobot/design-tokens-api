import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
export { type PutObjectCommandOutput, type _Error } from "@aws-sdk/client-s3";
// Set the AWS Region.
const REGION = process.env.AWS_REGION;
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });
export { s3Client };

export type PutObjectParams = {
  Bucket: string;
  Key: string;
  Body: string;
  ContentType?: string;
  ACL?: string;
};

export const putObject = async (params: PutObjectParams) => {
  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log("Success", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};
