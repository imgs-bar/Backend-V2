import {User} from '../src/documents/User';

declare module 'fastify' {
  interface PassportUser extends User {}
}
