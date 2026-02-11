import { createLogger } from 'afena-logger';

export const logger = createLogger({
  service: 'web-app',
  environment: process.env.NODE_ENV || 'development',
});

export default logger;
