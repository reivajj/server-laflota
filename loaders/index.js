const expressLoader = require('./express');
const Logger = require('./logger');

module.exports = async ({ expressApp }) => {
  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
  // ... more loaders can be here

  // ... Initialize agenda
  // ... or Redis, or whatever you want
}