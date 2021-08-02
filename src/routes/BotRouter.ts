import { FastifyInstance } from "fastify";
import { User } from "../documents/User";
import { botHandler, ResolveUser } from "../handlers/BotHandler";
import { changeUidInterface, botInterface } from "../interfaces/BotInterfaces";

export default async function BotRouter(router: FastifyInstance) {
  router.post<{ Body: changeUidInterface, Headers: botInterface }>(
    '/changeuid',
    {
      preHandler: [botHandler, ResolveUser],
      schema: {
        body: {
          type: 'object',
          required: ['uid', 'user'],
          properties: {
            uid: { type: 'integer' },
            user: { type: 'string' }
          },
        },
      },
    }, async (req, res) => {
      try {
        const { user } = req
        if (!user) {
          res.status(500).send({ error: 'Well, that shouldnt have happened' });
          return;
        }

        const NewUID = req.body.uid

        const UIDTakenCheck = await User.findOne({ uid: NewUID });
        if (UIDTakenCheck) return res.status(400).send({ message: 'UID already in use' });

        user.uid = NewUID
        user.save()

        res.send({ message: 'Updated UID successfully' })
        return;
      } catch (err) {
        res.status(500).send({ error: err.message })
        return;
      }
    }
  )
}
export const autoPrefix = '/bot';