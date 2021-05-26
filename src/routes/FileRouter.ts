import {FastifyInstance, FastifyPluginOptions} from 'fastify';
import multer from 'fastify-multer';
import * as crypto from 'crypto';

export default async function FileRouter(
  app: FastifyInstance,
  options: FastifyPluginOptions
) {
  const upload = multer({
    storage: multer.memoryStorage(),
  });
  app.post('/', {preHandler: upload.single('file')}, async (request, reply) => {
    if (!request.file || request.file.buffer === undefined) {
      return reply
        .status(400)
        .send({success: false, error: 'You need to provide a file!'});
    }
    const sha1 = crypto.createHash('sha1');
    return {hash: sha1.update(request.file.buffer).digest('hex')};
  });
}
export const autoPrefix = '/upload';
