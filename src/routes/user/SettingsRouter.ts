import {FastifyInstance} from 'fastify';

export default async function SettingsRouter(router: FastifyInstance) {
  router.addHook('preHandler', (request, reply, done) => {
    const {user} = request;
    if (!user) {
      return reply.status(403).send({message: 'Not logged in.'});
    }
    if (user.banned.status) {
      return reply.status(418).send({
        message: `ur banned, not teapot. reason: ${user.banned.reason}`,
      });
    }
    return done();
  });
  router.get('/', async (request, reply) => {
    const {user} = request;
    return reply.send({settings: user!.settings});
  });
}
export const autoPrefix = '/settings';
