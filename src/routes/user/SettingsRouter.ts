import {
  domainRemoveInterface,
  domainSettingBodyInterface,
} from './../../interfaces/SettingsInterfaces';
import {FastifyInstance} from 'fastify';
import {authHandler} from '../../handlers/AuthHandler';
import {
  settingsBodyInterface,
  settingsParamsInterface,
  urlLengthBodyInterface,
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
              enum: ['emojiUrl', 'showExtension'],
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

  router.patch<{Body: urlLengthBodyInterface}>(
    '/update/urlLength',
    {
      schema: {
        body: {
          type: 'object',
          required: ['status'],
          properties: {status: {type: 'number'}},
        },
      },
    },
    async (request, reply) => {
      const {user} = request;
      const {status} = request.body;

      await User.findByIdAndUpdate(user?._id, {
        'settings.urlLength': status,
      });
      return reply.send({
        message: 'Updated longURL',
        settings: user?.settings,
      });
    }
  );

  router.patch<{Body: settingsBodyInterface}>(
    '/update/embed',
    {
      schema: {
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

      await User.findByIdAndUpdate(user?._id, {
        'settings.embeds.enabled': status,
      });
      return reply.send({
        message: 'Updated longURL',
        settings: user?.settings,
      });
    }
  );

  router.put<{Body: domainSettingBodyInterface}>(
    '/update/domains',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'subDomain', 'fake', 'embeds', 'fileNamePrefix'],
          properties: {
            name: {type: 'string'},
            subDomain: {type: 'string'},
            fake: {type: 'boolean'},
            embeds: {type: 'array'},
            fileNamePrefix: {type: 'string'},
          },
        },
      },
    },
    async (request, reply) => {
      const {user} = request;
      const {name, subDomain, fake, embeds, fileNamePrefix} = request.body;

      user?.settings.domains.push({
        name,
        subDomain,
        fake,
        embeds,
        fileNamePrefix,
      });
      await user?.save();

      return reply.send({
        message: 'Added domain',
        settings: user?.settings,
      });
    }
  );

  router.delete<{Params: domainRemoveInterface}>(
    '/update/domains/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {type: 'string'},
          },
        },
      },
    },
    async (request, reply) => {
      const {user} = request;
      if (!user) {
        return reply.send({message: 'Unauthorized'});
      }

      const {id} = request.params;

      user.settings.domains = user.settings.domains.filter(
        domain => !domain.name.includes(id)
      );

      await user?.save();

      return reply.send({
        message: 'Removed domain',
        settings: user?.settings,
      });
    }
  );
}
export const autoPrefix = '/settings';
