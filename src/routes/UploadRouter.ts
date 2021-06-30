import {FastifyInstance} from 'fastify';
import multer from 'fastify-multer';
import * as crypto from 'crypto';
import {File} from '../documents/File';
import {minio} from '../util/MinIO';
import {generateFileName} from '../util/GenerationUtil';
import {uploadHandler} from '../handlers/UploadHandler';

export default async function UploadRouter(router: FastifyInstance) {
  const upload = multer({
    storage: multer.memoryStorage(),
  });
  router.post(
    '/sharex',
    {preHandler: [uploadHandler, upload.single('file')]},
    async (request, reply) => {
      const {user} = request;
      if (!request.file || request.file.buffer === undefined || !user) {
        return reply.status(400).send({message: 'You need to provide a file!'});
      }
      if (
        request.file.size! > 52_428_800 &&
        user.roles.premium &&
        user.roles.admin
      ) {
        return reply.status(413).send({message: 'File is too big!'});
      }
      const sha1 = crypto.createHash('sha1');
      const hash = sha1.update(request.file.buffer).digest('hex');
      const file = new File();
      file.fileName = generateFileName(user, request.file.originalname);
      file.originalFileName = request.file.originalname;
      file.hash = hash;
      file.uploader = user._id;
      file.embed =
        user.settings.embeds.list[
          Math.floor(Math.random() * user.settings.embeds.list.length)
        ];
      file.embed.enabled = user.settings.embeds.enabled;
      await file.save();

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
