import {Authenticator} from 'fastify-passport';
import {Strategy} from 'passport-local';
import {User} from '../documents/User';

export function setupPassport(passport: Authenticator) {
  passport.use(
    new Strategy((username, password, done) => {
      User.findOne({username: username}).then(user => {
        if (!user) {
          return done(null, false);
        }
        if (user.password !== password) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );

  passport.registerUserSerializer(async (user: User) => {
    return user._id;
  });

  passport.registerUserDeserializer(async id => {
    return User.findById(id);
  });
}
