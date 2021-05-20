const { urlencoded, json } = require('express');
const cors = require('cors');
const createError = require('http-errors');
const routes = require('../routes');
// import routes from '../routes/index.js';
const config = require('../config');
// import config from '../config/index.js';

module.exports = async ({ app }) => {

  let corsOptions = {
    // origin: 'https://laflota-dashboard.web.app',
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }

  app.get('/status', (_, res) => { res.status(200).end(); });
  app.head('/status', (_, res) => { res.status(200).end(); });
  app.enable('trust proxy');

  app.use(cors(corsOptions));
  app.use(urlencoded({ extended: false }));
  app.use(json());

  app.use((req, _, next) => {
    console.log(`Request_Endpoint: ${req.method} ${req.url}`);
    next();
  });

  // define a root route
  app.get(config.baseApi, (_, res) => {
    res.send(`V2 Hello World! V2`);
  });

  app.use(config.albumsApi, routes.albums);
  app.use(config.tracksApi, routes.tracks);
  // app.use(config.artistsApi, routes.artists);

  app.use((_, __, next) => {
    next(createError(404))
  });

  // Handlers error should go at the END
  app.use((error, _, res, __) => {
    res.status(error.status || 500)
    res.json({
      status: error.status,
      message: error.message,
      stack: error.stack,
      properties: error.properties || 'no props',
    })
  });

  return app;
}