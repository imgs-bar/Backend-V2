import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import fastifyAutoload from 'fastify-autoload';
import path = require('path');
import multer from 'fastify-multer/lib/lib/content-parser';
import {config} from 'dotenv';
import {connect} from 'mongoose';
import {checkBucket} from './util/MinIO';
import passport from 'fastify-passport';
import fastifySecureSesstion from 'fastify-secure-session';
const fs = require('fs');

import {setupPassport} from './util/SetupPassport';
config();

const PORT = process.env.PORT || 8080;
const server = fastify();

const errors = [];
const requiredVars = [
  'PORT',
  'MONGODB_URL',
  'MINIO_ENDPOINT',
  'MINIO_ACCESS_KEY',
  'MINIO_SECRET_KEY',
  'MINIO_BUCKET',
  'SECRET',
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

server.register(fastifySecureSesstion, {
  key: fs.readFileSync(path.join(__dirname, '../secret-key')),
  cookie: {
    httpOnly: true,
  },
});

//Security stuff
server.register(fastifyHelmet, {
  originAgentCluster: true,
  dnsPrefetchControl: true,
  permittedCrossDomainPolicies: true,
  hidePoweredBy: true,
});

server.register(fastifyCors, {
  origin: ['https://imgs.bar'],
  credentials: true,
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

server.listen(PORT, (err, address) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Server started on ' + address);
  connect(process.env.MONGODB_URL!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  });
  checkBucket().then();
});
