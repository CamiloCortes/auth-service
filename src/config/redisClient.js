const Redis = require('ioredis');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});
redisClient.on('connect', () => {
  console.log('Conectado a Redis');
});
redisClient.on('error', (err) => {
  console.error('Error en Redis:', err);
});

module.exports = redisClient;