import {FastifyInstance} from 'fastify';
import Cache from '../util/CacheUtil';
import {User} from '../documents/User';
import {File} from '../documents/File';
import {leaderBoardInterface} from '../interfaces/StatsInterfaces';

export default async function StatsRouter(router: FastifyInstance) {
  router.get('/', async (request, reply) => {
    let users = parseInt(await Cache.get('cache.users'));
    let files = parseInt(await Cache.get('cache.files'));
    if (!users) {
      users = await User.estimatedDocumentCount().exec();
      await Cache.set('cache.users', users);
    }
    if (!files) {
      files = await File.estimatedDocumentCount().exec();
      await Cache.set('cache.files', files);
    }
    return reply.send({
      users,
      files,
    });
  });

  router.get<{Params: leaderBoardInterface}>(
    '/leaderboards/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {id: {type: 'string', enum: ['uploads', 'invited']}},
        },
      },
    },
    async (request, reply) => {
      const {id} = request.params;

      let leaderBoard = await Cache.get(`leaderboard.${id}`);
      if (!leaderBoard) {
        leaderBoard = await User.find({})
          .sort({[id]: -1})
          .limit(10)
          .select(`${id} username _id `);

        await Cache.set(`leaderboard.${id}`, JSON.stringify(leaderBoard));
      }

      return reply.send(leaderBoard);
    }
  );
}
export const autoPrefix = '/stats';
