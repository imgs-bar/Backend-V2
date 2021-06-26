import {FastifyInstance} from 'fastify';
import Cache from '../util/CacheUtil';
import {User} from '../documents/User';
import {File} from '../documents/File';
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
      users: users,
      files: files,
    });
  });
}
export const autoPrefix = '/stats';
