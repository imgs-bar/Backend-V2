import {FastifyInstance} from 'fastify';

export default async function BaseRouter(app: FastifyInstance, options: any) {
  app.get('/', async (request, reply) => {
    reply.status(200).send({status: 200, message: 'Welcome to imgs.bar v2'});
  });
}
