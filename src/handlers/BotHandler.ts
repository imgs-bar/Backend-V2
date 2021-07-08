import {FastifyReply, FastifyRequest} from 'fastify';

export interface botInterface {
  key: string;
}

export async function botHandler(
  request: FastifyRequest<{Headers: botInterface}>,
  reply: FastifyReply
) {
  const {key} = request.headers;

  if (!key || key !== process.env.BOT_KEY) {
    return reply
      .status(401)
      .send({message: 'This endpoint requires authentication.'});
  }

  return;
}
