import {Authenticator} from 'fastify-passport';
import {Strategy} from 'passport-local';
import {User} from '../documents/User';
import {verify} from 'argon2';

export function setupPassport(passport: Authenticator) {
  passport.use(
    new Strategy(async (email, password, done) => {
      const user = await User.findOne({email});

      if (!user) return done(null, false);

      if (!(await verify(user.password, password))) {
        return done(null, false);
      }
      return done(null, user);
    })
  );

  passport.registerUserSerializer(async (user: User) => {
    return user._id;
  });

  passport.registerUserDeserializer(async id => {
    return User.findById(id);
  });
}
