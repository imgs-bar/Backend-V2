import {FastifyInstance} from 'fastify';
import multer from 'fastify-multer';
import * as crypto from 'crypto';
import {File} from '../schemas/FileSchema';

export default async function FileRouter(router: FastifyInstance) {
  const upload = multer({
    storage: multer.memoryStorage(),
  });
  router.post(
    '/',
    {preHandler: upload.single('file')},
    async (request, reply) => {
      if (!request.file || request.file.buffer === undefined) {
        return reply
          .status(400)
          .send({success: false, error: 'You need to provide a file!'});
      }
      const sha1 = crypto.createHash('sha1');
      const hash = sha1.update(request.file.buffer).digest('hex');
      const file = await File.create({
        hash,
        fileName: 'randomThing',
      });
      return {file};
    }
  );
}
export const autoPrefix = '/upload';
