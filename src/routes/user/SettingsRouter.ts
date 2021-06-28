import {FastifyInstance} from 'fastify';
import {authHandler} from '../../handlers/AuthHandler';

export default async function SettingsRouter(router: FastifyInstance) {
  router.addHook('preHandler', authHandler);

  router.get('/', async (request, reply) => {
    const {user} = request;
    return reply.send({settings: user!.settings});
  });
}
export const autoPrefix = '/settings';
