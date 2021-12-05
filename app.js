const app = require('./server');
const config = require('./config');
const loaders = require('./loaders');
const Logger = require('./loaders/logger');

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
