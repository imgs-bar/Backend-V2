import {FastifyInstance} from 'fastify';

export default async function BaseRouter(router: FastifyInstance) {
  router.get('/', async (request, reply) => {
    reply.send({message: 'Welcome to imgs.bar v2'});
  });

  router.get('/logout', async (request, reply) => {
    const {user} = request;

    if (!user) {
      return reply.status(401).send({message: 'You are not logged in.'});
    }

    request.logout();
    return reply.send({status: 200, message: 'ok done'});
  });
}
