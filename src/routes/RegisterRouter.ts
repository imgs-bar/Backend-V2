import {FastifyInstance} from 'fastify';
import {registerInterface} from '../interfaces/RegisterInterface';

export default async function RegisterRouter(router: FastifyInstance) {
  router.post<{Body: registerInterface}>('/', async (request, reply) => {
    if (
      !request.body ||
      !request.body.email ||
      !request.body.password ||
      !request.body.username
    ) {
      return reply.status(400).send({message: 'Please provide all fields'});
    }

    return reply.status(200).send({message: 'Created account!'});
  });
}
export const autoPrefix = '/register';
