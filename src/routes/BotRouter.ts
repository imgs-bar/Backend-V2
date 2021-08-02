import {
  changeUidInterface,
  botInterface,
  generateInviteInterface,
} from '../interfaces/BotInterfaces';
import {botHandler, ResolveUser} from '../handlers/BotHandler';
import {generateRandomString} from '../util/GenerationUtil';
import {Invite} from '../documents/Invite';
import {FastifyInstance} from 'fastify';
import {User} from '../documents/User';

export default async function BotRouter(router: FastifyInstance) {
  router.addHook('preHandler', botHandler);

  router.post<{Body: changeUidInterface; Headers: botInterface}>(
    '/changeuid',
    {
      preHandler: [ResolveUser],
      schema: {
        body: {
          type: 'object',
          required: ['uid', 'user'],
          properties: {
            uid: {type: 'integer'},
            user: {type: 'string'},
          },
        },
      },
    },
    async (req, res) => {
      try {
        const {user} = req;
        const {uid} = req.body;
        if (!user)
          return res
            .status(400)
            .send({message: 'Well, that shouldnt have happened'});

        const uidTaken = await User.findOne({uid});
        if (uidTaken)
          return res.status(400).send({message: 'UID already in use'});

        user.uid = uid;
        await user.save();

        return res.send({message: 'Updated UID successfully'});
      } catch (err) {
        return res.status(400).send({message: err.message});
      }
    }
  );

  router.post<{Body: generateInviteInterface; Headers: botInterface}>(
    '/generateInvites',
    {
      preHandler: [ResolveUser],
      schema: {
        body: {
          type: 'object',
          required: ['amount', 'user'],
          properties: {
            amount: {type: 'integer', maximum: 10, minimum: 1},
            user: {type: 'string'},
            expiresAt: {type: 'number'},
          },
        },
      },
    },
    async (req, res) => {
      const {user} = req;
      const {expiresAt, amount} = req.body;

      if (!user)
        return res
          .status(500)
          .send({error: 'Well, that shouldnt have happened'});
      //a
      const invites = [];
      for (let i = 0; i < amount; i++) {
        const invite = new Invite();
        invite._id = generateRandomString(40);
        invite.createdBy = user._id;
        invite.expiresAt = expiresAt;
        await invite.save();

        invites.push({
          link: `https://elixr.gifts/${invite._id}`,
          code: invite._id,
        });
      }

      return res.send({
        message: `Successfully generated ${amount} invites`,
        invites,
      });
    }
  );
}
export const autoPrefix = '/bot';
