import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import {uploadInterface} from '../interfaces/UploadInterface';
import {User} from '../documents/User';

export async function authHandler(server: FastifyInstance) {
  server.addHook('preHandler', (request, reply, done) => {
    const {user} = request;
    if (!user) {
      return reply.status(403).send({message: 'Not logged in.'});
    }
    if (user.banned.status) {
      return reply.status(418).send({
        message: `ur banned, not teapot. reason: ${user.banned.reason}`,
      });
    }
    return done();
  });
}
