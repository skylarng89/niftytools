import logger from './utils/logger';

// Test the logger with different levels
console.log('Testing logger with different levels...');

logger.debug('This is a DEBUG message');
logger.info('This is an INFO message');
logger.warn('This is a WARN message');
logger.error('This is an ERROR message');

console.log('Logger test with levels completed');
