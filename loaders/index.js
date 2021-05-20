import expressLoader from './express.js';
import Logger from './logger.js';

export default async ({ expressApp }) => {
  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
  // ... more loaders can be here

  // ... Initialize agenda
  // ... or Redis, or whatever you want
}