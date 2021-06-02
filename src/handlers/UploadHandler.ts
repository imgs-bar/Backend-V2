import {FastifyReply, FastifyRequest, HookHandlerDoneFunction} from 'fastify';
import {uploadInterface} from '../interfaces/UploadInterface';
import {User} from '../documents/User';

export async function uploadHandler(
  request: FastifyRequest<{Headers: uploadInterface}>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  if (!request.headers || !request.headers.key) {
    return reply.status(400).send({message: 'provide an upload key buh'});
  }
  const {key} = request.headers;

  const user = await User.findOne({key});

  if (!user) {
    return reply.status(401).send({message: 'key not valid loool'});
  }

  if (user.banned.status) {
    return reply
      .status(418)
      .send({message: `ur banned, not teapot. reason: ${user.banned.reason}`});
  }
  request.user = user;
  return done();
}
