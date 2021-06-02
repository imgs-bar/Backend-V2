import {FastifyInstance} from 'fastify';
import passport from 'fastify-passport';

export default async function LoginRouter(router: FastifyInstance) {
  router.post(
    '/',
    {preValidation: passport.authenticate('local')},
    async (request, reply) => {
      return reply.send({message: 'logged in!'});
    }
  );
}
export const autoPrefix = '/login';
