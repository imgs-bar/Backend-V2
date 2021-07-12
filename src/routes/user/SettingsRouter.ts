import {FastifyInstance} from 'fastify';
import {authHandler} from '../../handlers/AuthHandler';
import {
  settingsBodyInterface,
  settingsParamsInterface,
} from '../../interfaces/SettingsInterfaces';
import {User} from './../../documents/User';

/**
 * Settings route for authenticated users
 *
 * @export
 * @param {FastifyInstance} router
 */
export default async function SettingsRouter(router: FastifyInstance) {
  router.addHook('preHandler', authHandler);

  router.get('/', async (request, reply) => {
    const {user} = request;
    return reply.send({settings: user!.settings});
  });

  router.patch<{Params: settingsParamsInterface; Body: settingsBodyInterface}>(
    '/update/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string',
              enum: ['longUrl', 'emojiUrl', 'showExtension'],
            },
          },
        },
        body: {
          type: 'object',
          required: ['status'],
          properties: {status: {type: 'boolean'}},
        },
      },
    },
    async (request, reply) => {
      const {user} = request;
      const {status} = request.body;
      const {id} = request.params;

      await User.findByIdAndUpdate(user?._id, {
        [`settings.${id}`]: status,
      });
      return reply.send({
        message: 'Updated settings',
        settings: user?.settings,
      });
    }
  );
}
export const autoPrefix = '/settings';
