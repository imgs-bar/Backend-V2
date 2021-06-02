import {FastifyInstance} from 'fastify';
import multer from 'fastify-multer';
import * as crypto from 'crypto';
import {File} from '../documents/File';
import {minio} from '../util/MinIO';
import {generateRandomString} from '../util/GenerationUtil';
import {extname} from 'path';
import {uploadHandler} from '../handlers/UploadHandler';
import {configInterface} from '../interfaces/ConfigInterface';
import {User} from '../documents/User';

export default async function UploadRouter(router: FastifyInstance) {
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

  router.post<{Querystring: configInterface}>(
    '/config',
    async (request, reply) => {
      const {key} = request.query;
      if (!key) {
        return reply.status(400).send({message: 'provide an api key!'});
      }

      const user = await User.findOne({key});
      if (!user) {
        return reply.status(400).send({message: 'invalid keeeeey'});
      }

      const config = {
        Name: `${user.username} on imgs.bar.sxcu`,
        DestinationType: 'ImageUploader, FileUploader',
        RequestType: 'POST',
        RequestURL: 'https://beta.imgs.bar/upload/sharex',
        FileFormName: 'file',
        Body: 'MultipartFormData',
        Headers: {
          key,
        },
        URL: '$json:imageUrl$',
        DeletionURL: '$json:deletionUrl$',
        ErrorMessage: '$json:message$',
      };
      reply.header(
        'Content-Disposition',
        `attachment; filename=${user.username} on imgs.bar.sxcu`
      );
      return reply.send(Buffer.from(JSON.stringify(config, null, 2), 'utf8'));
    }
  );
}
export const autoPrefix = '/upload';
