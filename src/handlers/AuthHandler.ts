import {FastifyReply, FastifyRequest, HookHandlerDoneFunction} from 'fastify';

export async function authHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const {user} = request;
  if (!user) {
    return reply.status(403).send({message: 'Not logged in.'});
  }
  if (user.banned.status) {
    return reply.status(418).send({
      message: `ur banned, not teapot. reason: ${user.banned.reason}`,
    });
  }
  return;
}
