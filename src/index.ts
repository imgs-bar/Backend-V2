import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import fastifyAutoload from 'fastify-autoload';
import path = require('path');
import multer from 'fastify-multer/lib/lib/content-parser';
import {config} from 'dotenv';
import {connect} from 'mongoose';

config();

const PORT = process.env.PORT || 8080;
const server = fastify();

const errors = [];
const requiredVars = ['PORT', 'MONGODB_URL'];

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
/**/
server.register(fastifyCors, {
  origin: ['https://imgs.bar'],
  credentials: true,
});

server.register(multer);

server.register(fastifyHelmet, {
  originAgentCluster: true,
  dnsPrefetchControl: true,
  permittedCrossDomainPolicies: true,
  hidePoweredBy: true,
});
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
  if (process.env.MONGODB_URL === undefined) {
    throw new Error('Mongo undefined');
  }
  connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  });
});
