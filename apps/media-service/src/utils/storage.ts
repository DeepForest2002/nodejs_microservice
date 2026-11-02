import { AppError } from "shared";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

function getClientInfo() {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;
  const bucketName = process.env.STORAGE_BUCKET;

  if (!endpoint || !accessKeyId || !secretAccessKey || !region || !bucketName) {
    throw new AppError(500, "AWS storage configuration is missing");
  }

  const client = new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  return client;
}

export async function uploadBuffer(
  buffer: Buffer,
  contentType = "image/jpeg",
): Promise<{ image_url: string; public_id: string }> {
  const bucketName = process.env.STORAGE_BUCKET;
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;

  if (!bucketName || !endpoint) {
    throw new AppError(400, "Configs are missing");
  }
  const Key = `Support-task/${randomUUID}`;
  const s3client = getClientInfo();
  await s3client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  const baseUrl = endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint;
  return {
    image_url: `${baseUrl}/${Key}/${bucketName}`,
    public_id: Key,
  };
}

export default getClientInfo;
