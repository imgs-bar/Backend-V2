import {botInterface} from './../../handlers/BotHandler';
import {setMotdInterface} from './../../interfaces/InformationInterfaces';
import Filter from 'bad-words';
import {FastifyInstance} from 'fastify';
import {authHandler} from '../../handlers/AuthHandler';
import {botHandler} from '../../handlers/BotHandler';
import {getFromRedis, setInRedis} from '../../util/RedisUtil';

const filter = new Filter();

export default async function AuthRouter(router: FastifyInstance) {
  router.get('/motd', {preHandler: authHandler}, async (req, reply) => {
    const motd = getFromRedis('motd', 'Message of the day');
    reply.send({motd: motd});
  });

  router.patch<{Body: setMotdInterface; Headers: botInterface}>(
    '/motd',
    {
      preHandler: botHandler,
      schema: {
        body: {
          type: 'object',
          required: ['motd'],
          properties: {motd: {type: 'string'}},
        },
      },
    },
    async (req, reply) => {
      const {motd} = req.body;

      await setInRedis('motd', motd);

      reply.send({motd: motd});
    }
  );
}
export const autoPrefix = '/information';
