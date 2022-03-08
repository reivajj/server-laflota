const { json, urlencoded } = require('express');
const cors = require('cors');
const createError = require('http-errors');
const handleErrors = require('../middleware/handleErrors');
const routes = require('../routes');
const config = require('../config');
const cookieParser = require('cookie-parser');
const loginToFugaIfNeeded = require('../middleware/loginToFugaIfNeeded');

module.exports = async ({ app }) => {

  let corsOptions = {
    // origin: 'https://app.laflota.com.ar',
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }

  app.get('/status', (_, res) => { res.status(200).end(); });
  app.head('/status', (_, res) => { res.status(200).end(); });
  app.enable('trust proxy');

  app.use(cors(corsOptions));
  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(cookieParser());

  app.use((req, _, next) => {
    console.log(`Request_Endpoint: ${req.method} ${req.url}`);
    next();
  });

  // define a root route
  app.get(config.baseApi, (_, res) => {
    res.send(`Im alive`);
  });

  app.use(loginToFugaIfNeeded);

  app.use(config.albumsApi, routes.albums);
  app.use(config.tracksApi, routes.tracks);
  app.use(config.artistsApi, routes.artists);
  app.use(config.labelsApi, routes.labels);
  app.use(config.usersApi, routes.users);
  app.use(config.peopleApi, routes.people);
  app.use(config.firebaseApi, routes.firebase);
  app.use(config.spotifyApi, routes.spotify);
  app.use(config.csvApi, routes.csv);
  app.use(config.emailsApi, routes.emails);
  app.use(config.loginApi, routes.login);
  app.use(config.miscellaneousApi, routes.miscellaneous);

  app.use((_, __, next) => {
    next(createError(404))
  });

  // Handlers error should go at the END
  app.use(handleErrors);

  return app;
}