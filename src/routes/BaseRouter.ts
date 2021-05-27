import {FastifyInstance} from 'fastify';

export default async function BaseRouter(router: FastifyInstance) {
  router.get('/', async (request, reply) => {
    reply.status(200).send({status: 200, message: 'Welcome to imgs.bar v2'});
  });
}
