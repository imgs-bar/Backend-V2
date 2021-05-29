import {Client} from 'minio';
import {config} from 'dotenv';

config();
export const minio = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
  useSSL: false,
  port: 9000,
});

export async function checkBucket() {
  if (!(await minio.bucketExists(process.env.MINIO_BUCKET!))) {
    minio.makeBucket(process.env.MINIO_BUCKET!, 'eu-central-1', () => {
      console.log('Created MinIO Bucket.');
    });
  }
}
