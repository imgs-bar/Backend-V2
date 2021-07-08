import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import fastifyAutoload from 'fastify-autoload';
import multer from 'fastify-multer/lib/lib/content-parser';
import {config} from 'dotenv';
import mongoose from 'mongoose';
import {checkBucket} from './util/MinIO';
import passport from 'fastify-passport';
import fastifySecureSesstion from 'fastify-secure-session';
import fastifyRateLimit from 'fastify-rate-limit';
import Redis from 'ioredis';
import {setupPassport} from './util/SetupPassport';
import path = require('path');
import {checkPremium} from './routes/PremiumRouter';

config();
const errors = [];
const requiredVars = [
  'PORT',
  'MONGODB_URL',
  'MINIO_ENDPOINT',
  'MINIO_ACCESS_KEY',
  'MINIO_SECRET_KEY',
  'MINIO_BUCKET',
  'REDIS_URL',
  'COOKIE_SECRET',
];

for (const env of requiredVars) {
  // eslint-disable-next-line no-prototype-builtins
  if (!process.env.hasOwnProperty(env)) {
    errors.push(env);
  }
}

if (errors.length > 0)
  throw new Error(
    `${errors.join(', ')} ${errors.length > 1 ? 'are' : 'is'} required`
  );

const PORT = process.env.PORT || 8080;

const server = fastify({
  trustProxy: true,
});

//Redis for caching, so we can scale
export const redis = new Redis(process.env.REDIS_URL, {
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
  key: Buffer.from(process.env.COOKIE_SECRET!, 'hex'),
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
    .connect(process.env.MONGODB_URL!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
      (async () => {
        checkPremium();
        setInterval(checkPremium, 1 * 60 * 1000);
      })();

      checkBucket().then().catch();
    });
});

export {mongoose};
