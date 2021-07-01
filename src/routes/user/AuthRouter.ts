import {FastifyInstance} from 'fastify';
import {registerInterface} from '../../interfaces/RegisterInterface';
import {User} from '../../documents/User';
import {hash} from 'argon2';
import {v5} from 'uuid';
import {generateRandomString} from '../../util/GenerationUtil';
import {validateEmail} from '../../util/ValidationUtil';
import passport from 'fastify-passport';
import {getNextUid} from '../../util/RedisUtil';
import Filter from 'bad-words';
import {Invite} from '../../documents/Invite';
import {hasTimeExpired} from '../../util/Util';

const filter = new Filter();

export default async function AuthRouter(router: FastifyInstance) {
  router.post<{Body: registerInterface}>(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password', 'username', 'invite'],
          properties: {
            email: {type: 'string', format: 'email'},
            password: {type: 'string', maxLength: 100, minLength: 6},
            username: {type: 'string', minLength: 3, maxLength: 12},
            invite: {type: 'string', minLength: 40, maxLength: 40},
          },
        },
      },
    },
    async (request, reply) => {
      if (request.user) {
        return reply.status(400).send({message: 'You are already logged in.'});
      }

      const {email, password, username, invite} = request.body;

      if (filter.isProfane(username)) {
        return reply.status(400).send({message: 'Profane username.'});
      }

      const emailUsed = await User.findOne({
        email: email.toLocaleLowerCase(),
      });

      if (emailUsed) {
        return reply.status(400).send({message: 'Email is already in use.'});
      }

      const usernameUsed = await User.findOne({
        username: {$regex: new RegExp(username, 'i')},
      });

      if (usernameUsed) {
        return reply.status(400).send({message: 'Username already in use.'});
      }

      const inviteFound = await Invite.findById(invite);
      if (
        !inviteFound ||
        !inviteFound.usable ||
        hasTimeExpired(inviteFound.expiresAt)
      ) {
        return reply.status(404).send({message: 'Invite not found.'});
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

      inviteFound.usable = false;
      inviteFound.usages = inviteFound.usages + 1;
      inviteFound.usagesLeft = inviteFound.usagesLeft - 1;
      inviteFound.usedBy = user._id;
      await inviteFound.save();

      return reply.send({message: 'Created account!'});
    }
  );

  router.post(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password', 'username', 'invite'],
          properties: {
            username: {type: 'string', minLength: 3},
            password: {type: 'string', maxLength: 100, minLength: 6},
          },
        },
      },
      preValidation: passport.authenticate('local', {
        failWithError: true,
        authInfo: false,
      }),
    },
    async (request, reply) => {
      const {user} = request;
      if (!user) {
        return reply.status(500).send({message: 'Internal server error.'});
      }
      return reply.send({
        _id: user._id,
        uid: user.uid,
        username: user.username,
        settings: user.settings,
        roles: user.roles,
        banned: user.banned,
      });
    }
  );

  router.get('/', async (request, reply) => {
    const {user} = request;
    if (user) {
      return reply.send({
        authorized: true,
        user: {
          _id: user._id,
          uid: user.uid,
          username: user.username,
          settings: user.settings,
          roles: user.roles,
          banned: user.banned,
        },
      });
    }
    return reply.status(401).send({authorized: false});
  });
}
export const autoPrefix = '/auth';
