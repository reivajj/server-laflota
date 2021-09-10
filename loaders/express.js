const { urlencoded, json } = require('express');
const cors = require('cors');
const createError = require('http-errors');
const handleErrors = require('../middleware/handleErrors');
const routes = require('../routes');
const config = require('../config');

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
  app.use(config.artistsApi, routes.artists);
  app.use(config.labelsApi, routes.labels);
  app.use(config.emailsApi, routes.emails);

  app.use((_, __, next) => {
    next(createError(404))
  });

  // Handlers error should go at the END
  app.use(handleErrors);

  return app;
}