import { FastifyInstance } from "fastify";
import { User } from "../documents/User";
import { botHandler } from "../handlers/BotHandler";
import { ResolveUser } from "../handlers/ResolveUser";

export default function BotRouter(router: FastifyInstance, opts: any, done: any) {
    router.post('/changeuid', {
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
            if (typeof user !== 'object') {
                res.status(500).send({ error: 'Well, that shouldnt have happened' });
                return;
            }

            const NewUID = (req.body as any).uid
    
            const UIDTakenCheck = await User.findOne({ _id: NewUID });
            if (UIDTakenCheck) return res.status(400).send({ message: 'UID already in use' });
    
            user.uid = NewUID
            user.save()
    
            res.send({ message: 'Updated UID successfully' })
            return;
        } catch (err) {
            res.status(500).send({ error: err.message })
            return;
        }
    })

    done()
}
export const autoPrefix = '/bot';