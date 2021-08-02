import { changeUidInterface, botInterface, generateInviteInterface } from "../interfaces/BotInterfaces";
import { botHandler, ResolveUser } from "../handlers/BotHandler";
import { generateRandomString } from '../util/GenerationUtil';
import { Invite as InviteClass } from '../documents/Invite';
import { FastifyInstance } from "fastify";
import { User } from "../documents/User";


export default async function BotRouter(router: FastifyInstance) {
  router.addHook('preHandler', botHandler)

  router.post<{ Body: changeUidInterface, Headers: botInterface }>(
    '/changeuid',
    {
      preHandler: [ResolveUser],
      schema: {
        body: {
          type: 'object',
          required: ['uid', 'user'],
          properties: {
            uid: { type: 'integer', maximum: 0 },
            user: { type: 'string' }
          },
        },
      },
    }, async (req, res) => {
      try {
        const { user } = req
        if (!user) return res.status(500).send({ error: 'Well, that shouldnt have happened' });

        const NewUID = req.body.uid

        const UIDTakenCheck = await User.findOne({ uid: NewUID });
        if (UIDTakenCheck) return res.status(400).send({ message: 'UID already in use' });

        user.uid = NewUID;
        user.save();

        return res.send({ message: 'Updated UID successfully' });
      } catch (err) {
        return res.status(500).send({ error: err.message });
      }
    }
  )

  router.post<{ Body: generateInviteInterface, Headers: botInterface }>(
    '/generateInvites',
    {
      preHandler: [ResolveUser],
      schema: {
        body: {
          type: 'object',
          required: ['amount', 'user'],
          properties: {
            amount: { type: 'integer', maximum: 10, minimum: 1 },
            user: { type: 'string' },
            expiresAt: { type: 'number' }
          },
        },
      },
    }, async (req, res) => {
      const { user } = req
      const Invites: { link: string, code: string }[] = [];

      if (!user) return res.status(500).send({ error: 'Well, that shouldnt have happened' });

      if (new Date(req.body?.expiresAt) < new Date(Date.now())) {
        return res.status(400).send({ error: 'ExpiresAt time is set before the current date' })
      }

      for (let i = 0; i < req.body.amount; i++) {
        const Invite = new InviteClass()
        Invite._id = await generateRandomString(40);
        Invite.createdBy = user._id;
        Invite.expiresAt = new Date(req.body?.expiresAt).getTime() || -1
        Invite.save()

        Invites.push({ link: `https://elixr.gifts/${Invite._id}`, code: Invite._id })
      }

      return res.send({ message: `Successfully generated ${Invites.length} invites`, Invites })
    }
  )
}
export const autoPrefix = '/bot';