import OAuth from 'discord-oauth2';
import {FastifyInstance} from 'fastify';
import config from '../config/config.json';

const oauth = new OAuth({
  clientId: config.discord.clientId,
  version: 'v9',
  clientSecret: config.discord.clientSecret,
});
export default async function DomainRouter(router: FastifyInstance) {}

export const autoPrefix = '/discord';
