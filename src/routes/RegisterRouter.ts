import {FastifyInstance} from 'fastify';
import {registerInterface} from '../interfaces/RegisterInterface';
import {User} from '../documents/User';
import {hash} from 'argon2';
import {v5} from 'uuid';

export default async function RegisterRouter(router: FastifyInstance) {
  router.post<{Body: registerInterface}>('/', async (request, reply) => {
    if (
      !request.body ||
      !request.body.email ||
      !request.body.password ||
      !request.body.username
    ) {
      return reply.status(400).send({message: 'Please provide all fields'});
    }

    if (request.user) {
      return reply.status(400).send({message: 'Logged in???'});
    }

    const emailUsed = await User.findOne({
      email: request.body.email.toLocaleLowerCase(),
    });

    if (emailUsed) {
      return reply.status(400).send({message: 'Email already in use'});
    }

    const usernameUsed = await User.findOne({
      username: {$regex: new RegExp(request.body.username, 'i')},
    });

    if (usernameUsed) {
      return reply.status(400).send({message: 'Username in use!'});
    }

    const user = new User();
    user._id = v5(
      request.body.username,
      '03c35142-1374-47ae-9522-2c54395b57f4'
    );
    user.email = request.body.email.toLowerCase();
    user.username = request.body.username;
    user.password = await hash(request.body.password);
    user.embed = {
      enabled: false,
      author: 'default',
      description: 'default',
      title: 'default',
      siteName: 'default',
    };
    await user.save();
    return reply.status(200).send({message: 'Created account!'});
  });
}
export const autoPrefix = '/register';
