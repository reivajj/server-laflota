const config = require('../config');
var SpotifyWebApi = require('spotify-web-api-node');
const { getArtistByIdSpotify } = require("../third-party-api/spotify/spotify");

var spotify = require("express-promise-router")();

spotify.get('/login', async function (req, res) {
  let response = await requestToken(authOptions);
  res.status(200).send({ response })
});

spotify.get('/artists/:artistId', async (req, res, next) => {
  var spotifyApi = new SpotifyWebApi({
    clientId: config.spotify.spotifyId,
    clientSecret: config.spotify.spotifySecretCode,
  });

  const responseGetToken = await spotifyApi.clientCredentialsGrant();
  console.log("Response: ", responseGetToken.body);
  // console.log('The access token is ' + data.body['access_token']);

  // Save the access token so that it's used in future calls
  spotifyApi.setAccessToken(responseGetToken.body['access_token']);

  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      console.log('Artist albums', data.body);
      return res.status(200).send({ response: data.body });
    },
    function (err) {
      console.error(err);
    }
  );

});

module.exports = spotify;