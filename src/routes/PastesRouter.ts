import {FastifyInstance} from 'fastify';
import {Paste} from '../documents/Pastes';
import {generateRandomString} from '../util/GenerationUtil';
import {authHandler} from '../handlers/AuthHandler';
import {createPastesInterface} from './../interfaces/PastesInterfaces';

export default async function PastesRouter(router: FastifyInstance) {
  router.post<{Body: createPastesInterface}>(
    '/create',
    {
      preHandler: authHandler,
      schema: {
        body: {
          type: 'object',
          required: ['content'],
          properties: {
            content: {type: 'string'},
            deleteOnView: {type: 'boolean'},
            expiresAt: {type: 'integer'},
            password: {type: 'string'},
          },
        },
      },
    },
    async (request, reply) => {
      const {content, deleteOnView, expiresAt, password} = request.body;
      const {user} = request;

      if (!user)
        return reply.status(500).send({message: "This shouldn't happen"});

      const paste = new Paste();
      paste._id = generateRandomString(18);
      paste.content = content;
      paste.deleteOnView = deleteOnView || false;
      paste.expiresAt = expiresAt || -1;
      paste.deletionKey = generateRandomString(24);
      paste.createdAt = new Date();
      paste.createdBy = user._id;

      await paste.save();

      return reply.send({
        pasteUrl: `https://betaapi.imgs.bar/v2/pastes/view/${paste._id}`,
        deletionUrl: `https://betaapi.imgs.bar/v2/pastes/delete/${paste._id}`,
      });
    }
  );


}

export const autoPrefix = '/pastes';
