import {FastifyInstance} from 'fastify';
import {authHandler} from '../handlers/AuthHandler';

export default async function DomainRouter(router: FastifyInstance) {
  router.get('/list', {preHandler: authHandler}, async (req, res) => {
    res.send({
      message: 'Hello world!',
    });
  });
}
export const autoPrefix = '/domains';
