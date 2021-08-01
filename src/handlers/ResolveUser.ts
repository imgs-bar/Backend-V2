import { FastifyRequest, FastifyReply } from "fastify";
import { User } from '../documents/User';

export async function ResolveUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        const UserIdentifier = (request.body as any).user;

        let IdentifiedUser;

        if (parseInt(UserIdentifier) < 0 || parseInt(UserIdentifier) > 0) {
            IdentifiedUser = await User.findOne({
                $or:
                    [
                        { uid: UserIdentifier },
                        { 'discord.id': UserIdentifier }
                    ]
            });
        } else {
            IdentifiedUser = await User.findOne({
                $or:
                    [
                        { _id: UserIdentifier },
                        { email: UserIdentifier },
                        { username: new RegExp(`${UserIdentifier}`, 'i') }
                    ]
            });
        }
    
        if (!IdentifiedUser) reply.status(403).send({ error: `Unknown user` })
        else if (IdentifiedUser?.banned.status) reply.status(403).send({ error: `You are banned with the reason: ${IdentifiedUser.banned.reason}` })
        else request.user = IdentifiedUser;
        return;
    } catch (err) {
        reply.status(500).send({
            error: err.message
        })
    }
}