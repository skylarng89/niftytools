import logger from './utils/logger';

// Test the logger
logger.info('Test info message', { test: 'data' });
logger.warn('Test warn message', { warning: 'something happened' });
logger.error('Test error message', { error: 'something went wrong' });
logger.debug('Test debug message', { debug: 'detailed info' });

console.log('Logger test completed');
