/* eslint-disable @typescript-eslint/no-empty-interface */
import {User} from '../src/documents/User';

declare module 'fastify' {
  interface PassportUser extends User {}
}
