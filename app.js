import express from 'express';
import config from './config/index.js';
import loaders from './loaders/index.js';
import Logger from './loaders/logger.js';

async function startServer() {

  const app = express();

  loaders({ expressApp:app });

  app.listen(config.port, () => {
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
}

startServer();