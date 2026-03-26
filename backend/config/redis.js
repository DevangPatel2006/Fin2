import Redis from 'ioredis';
import logger from './logger.js';

let redisClient = null;

try {
  redisClient = new Redis(process.env.REDIS_URL, {
    retryStrategy: (times) => {
      if (times > 3) return null; // Stop retrying after 3 attempts
      return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 1,
  });

  redisClient.on('error', (err) => {
    logger.error('Redis Client Error:', err.message);
  });
} catch (err) {
  logger.error('Failed to initialize Redis:', err.message);
}

export default redisClient;
