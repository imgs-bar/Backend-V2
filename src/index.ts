import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import fastifyAutoload from 'fastify-autoload';
import path = require('path');
import multer from 'fastify-multer/lib/lib/content-parser';
const server = fastify();

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

server.listen(8080, (err, address) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Server started on ' + address);
});
