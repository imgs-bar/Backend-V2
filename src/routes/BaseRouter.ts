import {FastifyInstance} from 'fastify';
import passport from 'fastify-passport';

export default async function BaseRouter(router: FastifyInstance) {
  router.get('/', async (request, reply) => {
    reply.status(200).send({status: 200, message: 'Welcome to imgs.bar v2'});
  });

  router.get('/loggedin', async (request, reply) => {
    const user = request.user!;
    if (!user) {
      return reply.status(401).send({message: 'Not logged in trolar'});
    }

    return reply
      .status(200)
      .send({status: 200, message: 'Welcome to imgs.bar, ' + user.username});
  });

  router.get('/logout', async (request, reply) => {
    const user = request.user!;
    if (!user) {
      return reply.status(401).send({message: 'Not logged in trolar'});
    }

    request.logout();
    return reply.status(200).send({status: 200, message: 'ok done'});
  });
}
