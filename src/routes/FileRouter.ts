import {FastifyInstance} from 'fastify';
import multer from 'fastify-multer';
import * as crypto from 'crypto';
import {File} from '../documents/File';
import {minio} from '../util/MinIO';
import {generateRandomString} from '../util/GenerationUtil';
import {extname} from 'path';
import {uploadHandler} from '../handlers/UploadHandler';

export default async function FileRouter(router: FastifyInstance) {
  const upload = multer({
    storage: multer.memoryStorage(),
  });
  router.post(
    '/sharex',
    {preHandler: [uploadHandler, upload.single('file')]},
    async (request, reply) => {
      if (!request.file || request.file.buffer === undefined) {
        return reply.status(400).send({message: 'You need to provide a file!'});
      }
      if (
        request.file.size! > 52_428_800 &&
        !request.user!.roles.premium &&
        !request.user!.roles.admin
      ) {
        return reply.status(413).send({message: 'File is too big!'});
      }
      const sha1 = crypto.createHash('sha1');
      const hash = sha1.update(request.file.buffer).digest('hex');
      const file = await File.create({
        hash,
        fileName:
          generateRandomString(10) + extname(request.file.originalname!),
      });

      await minio.putObject(
        process.env.MINIO_BUCKET!,
        file.fileName,
        request.file.buffer
      );
      return {file};
    }
  );
}
export const autoPrefix = '/upload';
