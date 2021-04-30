import { urlencoded, json } from 'express';
import cors from 'cors';
import createError from 'http-errors';
import routes from '../routes';
import config from '../config';

export default async ({ app }) => {

  let corsOptions = {
    // origin: 'https://laflota-dashboard.web.app',
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }

  app.get('/status', (req, res) => { res.status(200).end(); });
  app.head('/status', (req, res) => { res.status(200).end(); });
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
  // app.use(config.tracksApi, routes.tracks);
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