import logger from './logger.js';

const validateEnv = () => {
  const { MONGO_URI, JWT_SECRET, PORT, GEMINI_API_KEY, REDIS_URL } = process.env;
  
  if (!MONGO_URI) {
    throw new Error('FATAL ERROR: MONGO_URI is not defined in environment variables');
  }
  
  if (!JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables');
  }
  
  if (!PORT) {
    logger.warn('WARNING: PORT is not defined. Defaulting to 5000');
  }
  
  if (!GEMINI_API_KEY) {
    logger.warn('WARNING: GEMINI_API_KEY is not defined. AI features may not work properly');
  }
  
  if (!REDIS_URL) {
    logger.warn('WARNING: REDIS_URL is not defined. Running without Redis cache');
  }
};

export default validateEnv;
