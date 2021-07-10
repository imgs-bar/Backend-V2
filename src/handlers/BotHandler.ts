import {FastifyReply, FastifyRequest} from 'fastify';
import config from '../config/config.json';
export interface botInterface {
  key: string;
}

export async function botHandler(
  request: FastifyRequest<{Headers: botInterface}>,
  reply: FastifyReply
) {
  const {key} = request.headers;

  if (!key || key !== config.authentication.bot) {
    return reply
      .status(401)
      .send({message: 'This endpoint requires authentication.'});
  }

  return;
}
