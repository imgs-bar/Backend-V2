import {extname} from 'path';
import config from '../config/config.json';
import {FastifyInstance} from 'fastify';
import multer from 'fastify-multer';
import * as crypto from 'crypto';
import {File} from '../documents/File';
import {minio} from '../util/MinIO';
import {generateFileName} from '../util/GenerationUtil';
import {uploadHandler} from '../handlers/UploadHandler';
import {v4 as uuid} from 'uuid';
export default async function UploadRouter(router: FastifyInstance) {
  const upload = multer({
    storage: multer.memoryStorage(),
  });

  router.post(
    '/sharex',
    {preHandler: [uploadHandler, upload.single('file')]},
    async (request, reply) => {
      try {
        const {user} = request;

        if (!user) {
          return reply.status(403).send({
            message: 'Unauthorized',
          });
        }
        if (
          !request.file ||
          request.file.buffer === undefined ||
          request.file.buffer.length === 0
        ) {
          return reply
            .status(400)
            .send({message: 'You need to provide a file!'});
        }
        if (
          request.file.size! > 52_428_800 &&
          user.roles.premium &&
          user.roles.admin
        ) {
          return reply.status(413).send({message: 'File is too big!'});
        }

        const cdnFileName =
          uuid() +
          '.' +
          request.file.originalname.split('.')[1] +
          extname(request.file.originalname);

        const sha1 = crypto.createHash('sha1');
        const hash = sha1.update(request.file.buffer).digest('hex');

        const file = new File();

        file.fileName = generateFileName(user, request.file.originalname);
        file.originalFileName = request.file.originalname;

        file.hash = hash;
        file.size = request.file.size!;

        file.cdnFileName = cdnFileName;

        file.uploader = user._id;

        file.embed = {
          ...user.settings.embeds.list[
            Math.floor(Math.random() * user.settings.embeds.list.length)
          ],
          enabled: user.settings.embeds.enabled,
        };

        await file.save();

        user.uploads += 1;
        await user.save();

        minio.putObject(config.minio.bucket, cdnFileName, request.file.buffer);

        return reply.send({
          imageUrl: `https://${config.minio.endpoint}/${config.minio.bucket}/${file.fileName}`,
        });
      } catch (error) {
        return reply.status(500).send({message: error.message});
      }
    }
  );
}
export const autoPrefix = '/upload';
