import CircuitBreaker from 'opossum';
import logger from './logger.js';

const fetchGemini = async (url, options) => {
  const fetch = global.fetch;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const circuitBreakerOptions = {
  timeout: 10000, 
  errorThresholdPercentage: 50,
  resetTimeout: 30000 
};

const geminiCircuitBreaker = new CircuitBreaker(fetchGemini, circuitBreakerOptions);

geminiCircuitBreaker.fallback(() => {
  return {
    candidates: [
      {
        content: {
           parts: [{ text: "AI service is temporarily unavailable. Please try again in a moment." }]
        }
      }
    ]
  };
});

geminiCircuitBreaker.on('open', () => logger.warn('Gemini Circuit Breaker opened'));
geminiCircuitBreaker.on('halfOpen', () => logger.info('Gemini Circuit Breaker half open'));
geminiCircuitBreaker.on('close', () => logger.info('Gemini Circuit Breaker closed'));

export default geminiCircuitBreaker;
