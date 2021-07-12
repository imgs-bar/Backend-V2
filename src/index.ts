import fastify from 'fastify';
import fastifyAutoload from 'fastify-autoload';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import multer from 'fastify-multer/lib/lib/content-parser';
import passport from 'fastify-passport';
import fastifyRateLimit from 'fastify-rate-limit';
import fastifySecureSesstion from 'fastify-secure-session';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import {checkInvites} from './routes/InviteRouter';
import {checkPremium} from './routes/PremiumRouter';
import {checkBucket} from './util/MinIO';
import {setupPassport} from './util/SetupPassport';
import path = require('path');

import config from './config/config.json';
import {sendStartup} from './util/LogUtil';
import {checkDomains} from './routes/DomainRouter';

const PORT = config.port || 8080;

const server = fastify({
  trustProxy: true,
});

//Redis for caching, so we can scale
export const redis = new Redis(config.redis.url, {
  connectionName: 'backend',
  connectTimeout: 0,
  maxRetriesPerRequest: 1,
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

server.register(fastifyCors, {
  origin: [
    'https://imgs.bar',
    'http://localhost:3000',
    'https://beta.imgs.bar',
    'https://frontend-v2-imgs-bar.vercel.app',
  ],
  credentials: true,
});

//Ratelimit
server.register(fastifyRateLimit, {
  timeWindow: 1000,
  max: 5,
  redis,
});

//Secure session for passport
server.register(fastifySecureSesstion, {
  key: Buffer.from(config.secrets.cookie, 'hex'),
  cookieName: 'session_id',
  cookie: {
    httpOnly: true,
    path: '/',
  },
});

//Security stuff
server.register(fastifyHelmet, {
  originAgentCluster: true,
  dnsPrefetchControl: true,
  permittedCrossDomainPolicies: true,
  hidePoweredBy: true,
});

//Disable cache
server.addHook('onRequest', async (req, reply) => {
  reply.headers({
    'Surrogate-Control': 'no-store',
    'Cache-Control': 'no-store, max-age=0, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  });
});

//Multer stuff
server.register(multer);

//Passport stuff

server.register(passport.initialize());
server.register(passport.secureSession());

setupPassport(passport);

//Load routes from directory
server.register(fastifyAutoload, {
  dir: path.join(__dirname, 'routes'),
  options: {
    prefix: '/v2',
  },
});

server.setNotFoundHandler(async (request, reply) => {
  return reply.status(404).send({message: 'Endpoint not found.'});
});

server.listen(PORT, '0.0.0.0', (err, address) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Server started on ' + address);
  mongoose
    .connect(config.mongo.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
      (async () => {
        //sendStartup();

        checkPremium();
        setInterval(checkPremium, 10 * 60 * 1000);

        checkInvites();
        setInterval(checkInvites, 60 * 60 * 1000);

        checkDomains();
        setInterval(checkDomains, 60 * 60 * 1000);
      })();

      checkBucket().then().catch();
    });
});

export {mongoose};
