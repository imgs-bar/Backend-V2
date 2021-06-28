import {FastifyInstance} from 'fastify';
import {Invite} from '../documents/Invite';
import {generateRandomString} from '../util/GenerationUtil';
import {authHandler} from '../handlers/AuthHandler';

export default async function InviteRouter(router: FastifyInstance) {
  router.register(authHandler);

  router.post('/create', async (request, reply) => {
    const {user} = request;
    if (!user)
      return reply.status(500).send({message: "This shouldn't happen"});

    if (!user.roles.admin && user.invites < 1) {
      return reply
        .status(403)
        .send({message: "You don't have any invites left to create."});
    }

    const invite = new Invite();
    invite._id = await generateRandomString(40);
    invite.createdBy = user._id;
    await invite.save();
    return reply.send({invite: invite._id});
  });
}
export const autoPrefix = '/invites';
