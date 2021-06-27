import {FastifyInstance} from 'fastify';
import {registerInterface} from '../../interfaces/RegisterInterface';
import {User} from '../../documents/User';
import {hash} from 'argon2';
import {v5} from 'uuid';
import {generateRandomString} from '../../util/GenerationUtil';
import {validateEmail} from '../../util/ValidationUtil';
import passport from 'fastify-passport';
import {getNextUid} from '../../util/RedisUtil';

export default async function AuthRouter(router: FastifyInstance) {
  router.post<{Body: registerInterface}>(
    '/register',
    async (request, reply) => {
      if (request.user) {
        return reply.status(400).send({message: 'Logged in???'});
      }

      const {email, password, username} = request.body;
      if (!email || !password || !username) {
        return reply.status(400).send({message: 'Please provide all fields'});
      }
      if (!validateEmail(email)) {
        return reply.status(400).send({message: 'invalid mail'});
      }

      if (password.length < 6) {
        return reply
          .status(400)
          .send({message: 'password at least 6 chars long'});
      }
      if (username.length < 3 || username.length > 12) {
        return reply.status(400).send({message: 'invalid username'});
      }

      const emailUsed = await User.findOne({
        email: email.toLocaleLowerCase(),
      });

      if (emailUsed) {
        return reply.status(400).send({message: 'Email already in use'});
      }

      const usernameUsed = await User.findOne({
        username: {$regex: new RegExp(username, 'i')},
      });

      if (usernameUsed) {
        return reply.status(400).send({message: 'Username in use!'});
      }

      const user = new User();
      user._id = v5(
        request.body.username,
        '03c35142-1374-47ae-9522-2c54395b57f4'
      );
      user.uid = await getNextUid();
      user.email = email.toLowerCase();
      user.username = username;
      user.password = await hash(password);
      user.key = `${username}_${generateRandomString(50)}`;
      await user.save();
      return reply.send({message: 'Created account!'});
    }
  );

  router.post(
    '/login',
    {
      preValidation: passport.authenticate('local', {
        failWithError: true,
      }),
    },
    async (request, reply) => {
      const {user} = request;
      if (!user) {
        return reply.status(401).send({message: 'There is no user wtf'});
      }
      return reply.send({
        _id: user._id,
        username: user.username,
        settings: user.settings,
        roles: user.roles,
        banned: user.banned,
      });
    }
  );
}
export const autoPrefix = '/';
