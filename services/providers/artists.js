const { getAllArtistsFromDashGo, uploadArtistToProvider } = require('../../third-party-api/providers/dashgo/artists');
const createDashGoArtist = require('../../models/artists');

const getAllArtists = async () => {
  const response = await getAllArtistsFromDashGo();
  return response;
}

const createArtist = async artistMetadata => {
  const artistFormData = createDashGoArtist(artistMetadata);
  const response = await uploadArtistToProvider(artistFormData);
  return response;
}

module.exports = { getAllArtists, createArtist };